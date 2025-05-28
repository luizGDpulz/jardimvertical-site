<?php
// API Index - Redirecionamento para documentação
header("HTTP/1.1 200 OK");
echo json_encode([
    "status" => "success",
    "message" => "API Jardim Vertical",
    "version" => "1.0.0",
    "endpoints" => [
        "/api/controllers/monitoring.php" => "Sistema de monitoramento em tempo real",
        "/api/controllers/contact.php" => "Formulário de contato",
        "/api/controllers/simulator.php" => "Simulador de jardim vertical",
        "/api/controllers/calculator.php" => "Calculadora de impacto ambiental"
    ]
]);
?>
