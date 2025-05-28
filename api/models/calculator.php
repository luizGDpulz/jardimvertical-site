<?php
class Calculator {
    private $conn;
    private $table_name = "calculator_results";

    public $id;
    public $garden_type;
    public $area;
    public $plant_count;
    public $co2_capture;
    public $temperature_reduction;
    public $energy_savings;
    public $air_quality_improvement;
    public $timestamp;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Criar tabela se não existir
    public function createTable() {
        $query = "CREATE TABLE IF NOT EXISTS " . $this->table_name . " (
            id INT AUTO_INCREMENT PRIMARY KEY,
            garden_type VARCHAR(50) NOT NULL,
            area DECIMAL(10,2) NOT NULL,
            plant_count INT NOT NULL,
            co2_capture DECIMAL(10,2) NOT NULL,
            temperature_reduction DECIMAL(5,2) NOT NULL,
            energy_savings DECIMAL(10,2) NOT NULL,
            air_quality_improvement DECIMAL(5,2) NOT NULL,
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

    // Salvar resultado do cálculo
    public function save() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET garden_type = :garden_type, 
                      area = :area, 
                      plant_count = :plant_count, 
                      co2_capture = :co2_capture, 
                      temperature_reduction = :temperature_reduction, 
                      energy_savings = :energy_savings, 
                      air_quality_improvement = :air_quality_improvement";
        
        $stmt = $this->conn->prepare($query);
        
        // Sanitizar dados
        $this->garden_type = htmlspecialchars(strip_tags($this->garden_type));
        $this->area = htmlspecialchars(strip_tags($this->area));
        $this->plant_count = htmlspecialchars(strip_tags($this->plant_count));
        $this->co2_capture = htmlspecialchars(strip_tags($this->co2_capture));
        $this->temperature_reduction = htmlspecialchars(strip_tags($this->temperature_reduction));
        $this->energy_savings = htmlspecialchars(strip_tags($this->energy_savings));
        $this->air_quality_improvement = htmlspecialchars(strip_tags($this->air_quality_improvement));
        
        // Vincular valores
        $stmt->bindParam(":garden_type", $this->garden_type);
        $stmt->bindParam(":area", $this->area);
        $stmt->bindParam(":plant_count", $this->plant_count);
        $stmt->bindParam(":co2_capture", $this->co2_capture);
        $stmt->bindParam(":temperature_reduction", $this->temperature_reduction);
        $stmt->bindParam(":energy_savings", $this->energy_savings);
        $stmt->bindParam(":air_quality_improvement", $this->air_quality_improvement);
        
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    // Calcular benefícios ambientais
    public function calculate($garden_type, $area) {
        // Valores base para cálculos (baseados em pesquisas)
        $plant_density = [
            'standard' => 25, // plantas por m²
            'intensive' => 40, // plantas por m²
            'extensive' => 15, // plantas por m²
            'modular' => 20  // plantas por m²
        ];
        
        $co2_capture_per_plant = 0.5; // kg por ano por planta
        $temp_reduction_factor = 0.05; // °C por m²
        $energy_savings_factor = 5; // R$ por m² por ano
        $air_quality_factor = 0.02; // melhoria percentual por m²
        
        // Verificar tipo de jardim
        if (!isset($plant_density[$garden_type])) {
            return false;
        }
        
        // Calcular número de plantas
        $this->garden_type = $garden_type;
        $this->area = $area;
        $this->plant_count = ceil($area * $plant_density[$garden_type]);
        
        // Calcular captura de CO2
        $this->co2_capture = $this->plant_count * $co2_capture_per_plant;
        
        // Calcular redução de temperatura
        $this->temperature_reduction = min(5, $area * $temp_reduction_factor);
        
        // Calcular economia de energia
        $this->energy_savings = $area * $energy_savings_factor;
        
        // Calcular melhoria da qualidade do ar
        $this->air_quality_improvement = min(30, $area * $air_quality_factor);
        
        return [
            'garden_type' => $this->garden_type,
            'area' => $this->area,
            'plant_count' => $this->plant_count,
            'co2_capture' => $this->co2_capture,
            'temperature_reduction' => $this->temperature_reduction,
            'energy_savings' => $this->energy_savings,
            'air_quality_improvement' => $this->air_quality_improvement
        ];
    }
}
?>
