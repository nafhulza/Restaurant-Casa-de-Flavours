<?php
require_once 'config.php';

header('Content-Type: application/json');

class OrderHandler {
    private $conn;
    
    public function __construct() {
        $this->conn = getDBConnection();
    }
    
    // Membuat pesanan baru
    public function createOrder($data) {
        $this->conn->begin_transaction();
        
        try {
            // Insert order utama
            $sql = "INSERT INTO orders (customer_name, total_amount, tax_amount, discount_amount, 
                    final_amount, payment_method, status) 
                    VALUES (?, ?, ?, ?, ?, ?, 'pending')";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("sdddds",
                $data['customer_name'],
                $data['total_amount'],
                $data['tax_amount'],
                $data['discount_amount'],
                $data['final_amount'],
                $data['payment_method']
            );
            $stmt->execute();
            $orderId = $stmt->insert_id;
            
            // Insert order items
            foreach ($data['items'] as $item) {
                $sql = "INSERT INTO order_items (order_id, product_id, product_name, quantity, price) 
                        VALUES (?, ?, ?, ?, ?)";
                $stmt = $this->conn->prepare($sql);
                $stmt->bind_param("iisid",
                    $orderId,
                    $item['product_id'],
                    $item['product_name'],
                    $item['quantity'],
                    $item['price']
                );
                $stmt->execute();
            }
            
            // Jika ada promo yang digunakan
            if (isset($data['promotion_id'])) {
                $sql = "INSERT INTO order_promotions (order_id, promotion_id, discount_amount) 
                        VALUES (?, ?, ?)";
                $stmt = $this->conn->prepare($sql);
                $stmt->bind_param("iid",
                    $orderId,
                    $data['promotion_id'],
                    $data['discount_amount']
                );
                $stmt->execute();
            }
            
            $this->conn->commit();
            return ['success' => true, 'order_id' => $orderId];
            
        } catch (Exception $e) {
            $this->conn->rollback();
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Mendapatkan semua pesanan
    public function getOrders($status = null) {
        if ($status) {
            $sql = "SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("s", $status);
            $stmt->execute();
            $result = $stmt->get_result();
        } else {
            $sql = "SELECT * FROM orders ORDER BY created_at DESC";
            $result = $this->conn->query($sql);
        }
        
        $orders = [];
        while($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
        
        return $orders;
    }
    
    // Mendapatkan detail pesanan
    public function getOrderDetails($orderId) {
        // Data order utama
        $sql = "SELECT * FROM orders WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        $order = $stmt->get_result()->fetch_assoc();
        
        // Items order
        $sql = "SELECT * FROM order_items WHERE order_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        $items = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        // Promo yang digunakan
        $sql = "SELECT p.* FROM order_promotions op 
                JOIN promotions p ON op.promotion_id = p.id 
                WHERE op.order_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        $promotion = $stmt->get_result()->fetch_assoc();
        
        return [
            'order' => $order,
            'items' => $items,
            'promotion' => $promotion
        ];
    }
    
    // Update status pesanan
    public function updateOrderStatus($orderId, $status) {
        $sql = "UPDATE orders SET status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("si", $status, $orderId);
        
        return $stmt->execute();
    }
}

// Handle requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $orderHandler = new OrderHandler();
    
    if (isset($input['action'])) {
        switch($input['action']) {
            case 'create':
                $result = $orderHandler->createOrder($input);
                echo json_encode($result);
                break;
                
            case 'update_status':
                $success = $orderHandler->updateOrderStatus($input['order_id'], $input['status']);
                echo json_encode(['success' => $success]);
                break;
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $orderHandler = new OrderHandler();
    
    if (isset($_GET['order_id'])) {
        $details = $orderHandler->getOrderDetails($_GET['order_id']);
        echo json_encode($details);
    } else {
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        $orders = $orderHandler->getOrders($status);
        echo json_encode($orders);
    }
}
?>