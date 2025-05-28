<?php
// Incluir arquivos necessários
require_once '../config/database.php';
require_once '../config/core.php';
require_once '../models/monitoring_data.php';

// Instanciar conexão com o banco de dados
$database = new Database();
$db = $database->getConnection();

// Instanciar objeto de dados de monitoramento
$monitoring_data = new MonitoringData($db);

// Criar tabela se não existir
$monitoring_data->createTable();

// Processar requisição
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Verificar se é solicitação para um sensor específico
    if (isset($_GET['sensor_id'])) {
        $monitoring_data->sensor_id = $_GET['sensor_id'];
        $stmt = $monitoring_data->readBySensor();
    } else {
        // Buscar todos os dados
        $stmt = $monitoring_data->read();
    }
    
    $num = $stmt->rowCount();
    
    if ($num > 0) {
        $data_arr = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            $data_item = array(
                "id" => $id,
                "sensor_id" => $sensor_id,
                "temperature" => $temperature,
                "humidity" => $humidity,
                "light_level" => $light_level,
                "soil_moisture" => $soil_moisture,
                "plant_health" => $plant_health,
                "timestamp" => $timestamp
            );
            
            array_push($data_arr, $data_item);
        }
        
        response(200, "Dados encontrados", $data_arr);
    } else {
        response(404, "Nenhum dado encontrado");
    }
} 
// Processar requisição para criar novo registro
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        response(400, "Dados inválidos");
    }
    
    // Verificar se é solicitação para gerar dados de demonstração
    if (isset($data['generate_demo']) && $data['generate_demo'] === true) {
        $count = isset($data['count']) ? intval($data['count']) : 50;
        
        if ($monitoring_data->generateDemoData($count)) {
            response(201, "Dados de demonstração gerados com sucesso");
        } else {
            response(500, "Erro ao gerar dados de demonstração");
        }
    } 
    // Criar novo registro com dados fornecidos
    else {
        // Verificar parâmetros obrigatórios
        $required_fields = ['sensor_id', 'temperature', 'humidity', 'light_level', 'soil_moisture', 'plant_health'];
        foreach ($required_fields as $field) {
            if (!isset($data[$field])) {
                response(400, "Campo obrigatório ausente: " . $field);
            }
        }
        
        // Atribuir valores
        $monitoring_data->sensor_id = $data['sensor_id'];
        $monitoring_data->temperature = $data['temperature'];
        $monitoring_data->humidity = $data['humidity'];
        $monitoring_data->light_level = $data['light_level'];
        $monitoring_data->soil_moisture = $data['soil_moisture'];
        $monitoring_data->plant_health = $data['plant_health'];
        
        if ($monitoring_data->create()) {
            response(201, "Registro criado com sucesso");
        } else {
            response(500, "Erro ao criar registro");
        }
    }
} else {
    response(405, "Método não permitido");
}
?>
