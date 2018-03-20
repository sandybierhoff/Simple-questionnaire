<?php
    
    // Test data

    $response = [
        'rank'=>4,
        'total'=>20,
        'users'=>[
            ['user'=>'Lana', 'evaluation'=>51],
            ['user'=>'Nick', 'evaluation'=>23],
            ['user'=>'Darya', 'evaluation'=>16],
            ['user'=>'Ashley', 'evaluation'=>10],
            ['user'=>'Nastya', 'evaluation'=>7],
        ]
    ];

    echo json_encode( $response );