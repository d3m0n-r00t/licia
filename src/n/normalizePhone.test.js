test([
    // CN
    [
        '13512345678',
        {
            countryCode: 86
        },
        '+8613512345678'
    ],
    // USA
    [
        '(415) 555-2671',
        {
            countryCode: 1
        },
        ,
        '+14155552671'
    ],
    // UK
    [
        '020 7183 8750',
        {
            countryCode: 44,
            trunkPrefix: true
        },
        '+442071838750'
    ]
]);
