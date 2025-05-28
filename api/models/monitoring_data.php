<?php
class MonitoringData {
    private $conn;
    private $table_name = "monitoring_data";

    public $id;
    public $sensor_id;
    public $temperature;
    public $humidity;
    public $light_level;
    public $soil_moisture;
    public $plant_health;
    public $timestamp;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Criar tabela se não existir
    public function createTable() {
        $query = "CREATE TABLE IF NOT EXISTS " . $this->table_name . " (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sensor_id VARCHAR(50) NOT NULL,
            temperature DECIMAL(5,2) NOT NULL,
            humidity DECIMAL(5,2) NOT NULL,
            light_level DECIMAL(5,2) NOT NULL,
            soil_moisture DECIMAL(5,2) NOT NULL,
            plant_health VARCHAR(20) NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return true;
        } catch(PDOException $e) {
            return false;
        }
    }

    // Ler todos os dados de monitoramento
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY timestamp DESC LIMIT 100";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    // Ler dados de um sensor específico
    public function readBySensor() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE sensor_id = :sensor_id 
                  ORDER BY timestamp DESC 
                  LIMIT 100";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":sensor_id", $this->sensor_id);
        $stmt->execute();
        
        return $stmt;
    }

    // Criar novo registro de monitoramento
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET sensor_id = :sensor_id, 
                      temperature = :temperature, 
                      humidity = :humidity, 
                      light_level = :light_level, 
                      soil_moisture = :soil_moisture, 
                      plant_health = :plant_health";
        
        $stmt = $this->conn->prepare($query);
        
        // Sanitizar dados
        $this->sensor_id = htmlspecialchars(strip_tags($this->sensor_id));
        $this->temperature = htmlspecialchars(strip_tags($this->temperature));
        $this->humidity = htmlspecialchars(strip_tags($this->humidity));
        $this->light_level = htmlspecialchars(strip_tags($this->light_level));
        $this->soil_moisture = htmlspecialchars(strip_tags($this->soil_moisture));
        $this->plant_health = htmlspecialchars(strip_tags($this->plant_health));
        
        // Vincular valores
        $stmt->bindParam(":sensor_id", $this->sensor_id);
        $stmt->bindParam(":temperature", $this->temperature);
        $stmt->bindParam(":humidity", $this->humidity);
        $stmt->bindParam(":light_level", $this->light_level);
        $stmt->bindParam(":soil_moisture", $this->soil_moisture);
        $stmt->bindParam(":plant_health", $this->plant_health);
        
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    // Gerar dados simulados para demonstração
    public function generateDemoData($count = 50) {
        $sensors = ["sensor_01", "sensor_02", "sensor_03", "sensor_04"];
        $health_status = ["excellent", "good", "fair", "needs_attention", "critical"];
        
        $success = true;
        
        for($i = 0; $i < $count; $i++) {
            $this->sensor_id = $sensors[array_rand($sensors)];
            $this->temperature = rand(180, 320) / 10; // 18.0 - 32.0
            $this->humidity = rand(300, 800) / 10; // 30.0 - 80.0
            $this->light_level = rand(100, 1000) / 10; // 10.0 - 100.0
            $this->soil_moisture = rand(200, 900) / 10; // 20.0 - 90.0
            $this->plant_health = $health_status[array_rand($health_status)];
            
            if(!$this->create()) {
                $success = false;
            }
        }
        
        return $success;
    }
}
?>
