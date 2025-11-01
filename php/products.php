<?php
require_once 'config.php';

header('Content-Type: application/json');

class ProductHandler {
    private $conn;
    
    public function __construct() {
        $this->conn = getDBConnection();
    }
    
    // Mendapatkan semua produk
    public function getProducts() {
        $sql = "SELECT * FROM products WHERE is_active = 1 ORDER BY name";
        $result = $this->conn->query($sql);
        
        $products = [];
        while($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        
        return $products;
    }
    
    // Mendapatkan produk berdasarkan kategori
    public function getProductsByCategory($category) {
        $sql = "SELECT * FROM products WHERE category = ? AND is_active = 1 ORDER BY name";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $category);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $products = [];
        while($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        
        return $products;
    }
    
    // Mendapatkan produk best seller
    public function getBestSellerProducts() {
        $sql = "SELECT * FROM products WHERE best_seller = 1 AND is_active = 1 ORDER BY name";
        $result = $this->conn->query($sql);
        
        $products = [];
        while($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        
        return $products;
    }
    
    // Menambah produk baru
    public function addProduct($data) {
        $sql = "INSERT INTO products (name, description, price, category, best_seller, image, is_active) 
                VALUES (?, ?, ?, ?, ?, ?, 1)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssdsis", 
            $data['name'], 
            $data['description'], 
            $data['price'], 
            $data['category'], 
            $data['best_seller'], 
            $data['image']
        );
        
        return $stmt->execute();
    }
    
    // Mengupdate produk
    public function updateProduct($id, $data) {
        $sql = "UPDATE products SET name = ?, description = ?, price = ?, category = ?, 
                best_seller = ?, image = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssdsisi", 
            $data['name'], 
            $data['description'], 
            $data['price'], 
            $data['category'], 
            $data['best_seller'], 
            $data['image'],
            $id
        );
        
        return $stmt->execute();
    }
    
    // Menghapus produk (soft delete)
    public function deleteProduct($id) {
        $sql = "UPDATE products SET is_active = 0 WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
}

// Handle requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $productHandler = new ProductHandler();
    
    if (isset($_GET['category'])) {
        $products = $productHandler->getProductsByCategory($_GET['category']);
    } elseif (isset($_GET['best_seller'])) {
        $products = $productHandler->getBestSellerProducts();
    } else {
        $products = $productHandler->getProducts();
    }
    
    echo json_encode($products);
}
?>