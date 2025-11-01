<?php
require_once 'config.php';

header('Content-Type: application/json');

class PromotionHandler {
    private $conn;
    
    public function __construct() {
        $this->conn = getDBConnection();
    }
    
    // Mendapatkan semua promo aktif
    public function getActivePromotions() {
        $currentDate = date('Y-m-d');
        $sql = "SELECT * FROM promotions WHERE valid_until >= ? AND is_active = 1 ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $currentDate);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $promotions = [];
        while($row = $result->fetch_assoc()) {
            $promotions[] = $row;
        }
        
        return $promotions;
    }
    
    // Mendapatkan promo berdasarkan ID
    public function getPromotionById($id) {
        $sql = "SELECT * FROM promotions WHERE id = ? AND is_active = 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        return $result->fetch_assoc();
    }
    
    // Validasi promo
    public function validatePromotion($promoId, $totalAmount, $orderItems) {
        $promotion = $this->getPromotionById($promoId);
        
        if (!$promotion) {
            return ['valid' => false, 'message' => 'Promo tidak ditemukan'];
        }
        
        // Cek minimum order
        if ($totalAmount < $promotion['min_order_amount']) {
            return [
                'valid' => false, 
                'message' => 'Minimum order Rp ' . number_format($promotion['min_order_amount'], 0, ',', '.') . ' untuk promo ini'
            ];
        }
        
        // Cek kategori yang berlaku
        if ($promotion['applicable_categories'] !== 'all') {
            $applicableCategories = json_decode($promotion['applicable_categories'], true);
            $hasApplicableItems = false;
            
            foreach ($orderItems as $item) {
                if (in_array($item['category'], $applicableCategories)) {
                    $hasApplicableItems = true;
                    break;
                }
            }
            
            if (!$hasApplicableItems) {
                return ['valid' => false, 'message' => 'Tidak ada item yang memenuhi syarat promo'];
            }
        }
        
        // Cek tanggal berlaku
        $currentDate = date('Y-m-d');
        if ($currentDate > $promotion['valid_until']) {
            return ['valid' => false, 'message' => 'Promo sudah kadaluarsa'];
        }
        
        return ['valid' => true, 'promotion' => $promotion];
    }
    
    // Menghitung diskon
    public function calculateDiscount($promotion, $totalAmount, $orderItems) {
        switch($promotion['discount_type']) {
            case 'percentage':
                return ($totalAmount * $promotion['discount_value']) / 100;
                
            case 'fixed_amount':
                return min($promotion['discount_value'], $totalAmount);
                
            case 'free_item':
                // Implementasi free item logic
                return $this->calculateFreeItemDiscount($promotion, $orderItems);
                
            case 'buy_x_get_y':
                // Implementasi buy x get y logic
                return $this->calculateBuyXGetYDiscount($promotion, $orderItems);
                
            default:
                return 0;
        }
    }
    
    private function calculateFreeItemDiscount($promotion, $orderItems) {
        // Logic untuk free item
        return 0; // Placeholder
    }
    
    private function calculateBuyXGetYDiscount($promotion, $orderItems) {
        // Logic untuk buy x get y
        return 0; // Placeholder
    }
}

// Handle requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $promotionHandler = new PromotionHandler();
    $promotions = $promotionHandler->getActivePromotions();
    echo json_encode($promotions);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $promotionHandler = new PromotionHandler();
    
    if (isset($input['action']) && $input['action'] === 'validate') {
        $validation = $promotionHandler->validatePromotion(
            $input['promo_id'],
            $input['total_amount'],
            $input['order_items']
        );
        echo json_encode($validation);
    }
}
?>