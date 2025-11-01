<?php
require_once 'config.php';

header('Content-Type: application/json');

class ReservationHandler {
    private $conn;
    
    public function __construct() {
        $this->conn = getDBConnection();
    }
    
    // Membuat reservasi baru
    public function createReservation($data) {
        $sql = "INSERT INTO reservations (customer_name, phone, reservation_date, reservation_time, 
                number_of_guests, special_requests, status) 
                VALUES (?, ?, ?, ?, ?, ?, 'pending')";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssis", 
            $data['customer_name'],
            $data['phone'],
            $data['reservation_date'],
            $data['reservation_time'],
            $data['number_of_guests'],
            $data['special_requests']
        );
        
        if ($stmt->execute()) {
            return ['success' => true, 'reservation_id' => $stmt->insert_id];
        } else {
            return ['success' => false, 'error' => $stmt->error];
        }
    }
    
    // Mendapatkan semua reservasi
    public function getReservations($date = null) {
        if ($date) {
            $sql = "SELECT * FROM reservations WHERE reservation_date = ? ORDER BY reservation_time";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("s", $date);
            $stmt->execute();
            $result = $stmt->get_result();
        } else {
            $sql = "SELECT * FROM reservations ORDER BY reservation_date DESC, reservation_time DESC";
            $result = $this->conn->query($sql);
        }
        
        $reservations = [];
        while($row = $result->fetch_assoc()) {
            $reservations[] = $row;
        }
        
        return $reservations;
    }
    
    // Update status reservasi
    public function updateReservationStatus($id, $status) {
        $sql = "UPDATE reservations SET status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("si", $status, $id);
        
        return $stmt->execute();
    }
    
    // Cek ketersediaan meja
    public function checkAvailability($date, $time, $guests) {
        $sql = "SELECT COUNT(*) as count FROM reservations 
                WHERE reservation_date = ? AND reservation_time = ? AND status IN ('pending', 'confirmed')";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $date, $time);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        // Asumsi kapasitas restoran 50 orang
        $maxCapacity = 50;
        $currentReservations = $row['count'] * 4; // Asumsi rata-rata 4 orang per reservasi
        
        return ($currentReservations + $guests) <= $maxCapacity;
    }
}

// Handle requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $reservationHandler = new ReservationHandler();
    
    if (isset($input['action'])) {
        switch($input['action']) {
            case 'create':
                $result = $reservationHandler->createReservation($input);
                echo json_encode($result);
                break;
                
            case 'check_availability':
                $available = $reservationHandler->checkAvailability(
                    $input['date'],
                    $input['time'],
                    $input['guests']
                );
                echo json_encode(['available' => $available]);
                break;
                
            case 'update_status':
                $success = $reservationHandler->updateReservationStatus(
                    $input['id'],
                    $input['status']
                );
                echo json_encode(['success' => $success]);
                break;
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $reservationHandler = new ReservationHandler();
    $date = isset($_GET['date']) ? $_GET['date'] : null;
    $reservations = $reservationHandler->getReservations($date);
    echo json_encode($reservations);
}
?>