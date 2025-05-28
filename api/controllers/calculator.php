<?php
// Incluir arquivos necessários
require_once '../config/database.php';
require_once '../config/core.php';
require_once '../models/calculator.php';

// Instanciar conexão com o banco de dados
$database = new Database();
$db = $database->getConnection();

// Instanciar objeto de calculadora
$calculator = new Calculator($db);

// Criar tabela se não existir
$calculator->createTable();

// Processar requisição
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        response(400, "Dados inválidos");
    }
    
    // Verificar parâmetros obrigatórios
    $required_fields = ['garden_type', 'area'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field])) {
            response(400, "Campo obrigatório ausente: " . $field);
        }
    }
    
    // Calcular benefícios ambientais
    $result = $calculator->calculate($data['garden_type'], $data['area']);
    
    if ($result) {
        // Salvar resultado no banco de dados
        if ($calculator->save()) {
            response(200, "Cálculo realizado com sucesso", $result);
        } else {
            response(500, "Erro ao salvar resultado", $result);
        }
    } else {
        response(400, "Erro ao calcular benefícios ambientais");
    }
} else {
    response(405, "Método não permitido");
}
?>
