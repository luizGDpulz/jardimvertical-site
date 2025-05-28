<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Função para gerar resposta JSON
function response($status, $message, $data = null) {
    header("HTTP/1.1 " . $status);
    
    $response = [
        "status" => $status,
        "message" => $message
    ];
    
    if ($data !== null) {
        $response["data"] = $data;
    }
    
    echo json_encode($response);
    exit;
}

// Função para validar requisições
function validateRequest($method, $requiredParams = []) {
    // Verificar método HTTP
    if ($_SERVER["REQUEST_METHOD"] !== $method) {
        response(405, "Método não permitido");
    }
    
    // Para requisições POST, PUT, verificar parâmetros obrigatórios
    if ($method === "POST" || $method === "PUT") {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            response(400, "Dados inválidos");
        }
        
        foreach ($requiredParams as $param) {
            if (!isset($data[$param]) || empty($data[$param])) {
                response(400, "Parâmetro obrigatório ausente: " . $param);
            }
        }
        
        return $data;
    }
    
    return null;
}
?>
