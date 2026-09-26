/* =========================================
   PRODUTOS - SANTO BRIGADEIRO
========================================= */

const produtos = [

    {
        id: 1,
        nome: "Bolo Confeitado",
        categoria: "bolos",
        preco: 60.00,
        imagem: "",
        descricao: "Bolo confeitado personalizado para sua comemoração.",
        destaque: true,

        tamanhos: [
            {
                nome: "500g",
                peso: 0.5,
                serve: "Serve aproximadamente 3 pessoas",
                precoComum: 60.00,
                precoPremium: 75.00
            },
            {
                nome: "1kg",
                peso: 1,
                serve: "Serve aproximadamente 10 pessoas",
                precoComum: 120.00,
                precoPremium: 150.00
            },
            {
                nome: "1,5kg",
                peso: 1.5,
                serve: "Serve aproximadamente 15 pessoas",
                precoComum: 180.00,
                precoPremium: 225.00
            },
            {
                nome: "2kg",
                peso: 2,
                serve: "Serve aproximadamente 20 pessoas",
                precoComum: 240.00,
                precoPremium: 300.00
            },
          {
                nome: "3kg",
                peso: 3,
                serve: "Serve aproximadamente 30 pessoas",
                precoComum: 345.00,
                precoPremium: 435.00
            },
            {
                nome: "4kg",
                peso: 4,
                serve: "Serve aproximadamente 40 pessoas",
                precoComum: 465.00,
                precoPremium: 585.00
            },
            {
                nome: "5kg",
                peso: 5,
                serve: "Serve aproximadamente 50 pessoas",
                precoComum: 585.00,
                precoPremium: 735.00
            }
        ],

        massas: [
            "Branca",
            "Chocolate"
        ],

        recheiosComuns: [
            "4 Leites",
            "Bicho de pé",
            "Creme Ninho",
            "Doce de leite",
            "Brigadeiro",
            "Prestígio",
            "Sonho de Oreo",
            "Dois amores",
            "Olho de sogra"
        ],

        recheiosPremium: [
            "Ninho com morangos",
            "Brigadeiro com morango",
            "Creme de avelã",
            "Nozes",
            "Surpresa de uva",
            "Tropical"
        ]
    },

    {
        id: 2,
        nome: "Kit Mesversário",
        categoria: "kits",
        preco: 160.00,
        imagem: "",
        descricao: "Kit especial para comemorar o mesversário.",
        destaque: true
    },

    {
        id: 3,
        nome: "Brigadeiro Tradicional",
        categoria: "doces",
        preco: 3.00,
        imagem: "",
        descricao: "Brigadeiro tradicional feito com chocolate.",
        destaque: true
    },

    {
        id: 4,
        nome: "Cento de Salgados",
        categoria: "salgados",
        preco: 80.00,
        imagem: "",
        descricao: "Salgados variados para sua festa.",
        destaque: false
    },

        {
        id: 5,
        nome: "Topo Simples",
        categoria: "topos",
        preco: 15.00,
        imagem: "",
        descricao: "Topo personalizado simples para deixar seu bolo ainda mais especial.",
        destaque: false
    },

    {
        id: 6,
        nome: "Topo 2D",
        categoria: "topos",
        preco: 25.00,
        imagem: "",
        descricao: "Topo personalizado 2D desenvolvido de acordo com o tema da sua comemoração.",
        destaque: false
    },

    {
        id: 7,
        nome: "Topo 3D",
        categoria: "topos",
        preco: 35.00,
        imagem: "",
        descricao: "Topo personalizado 3D para deixar sua decoração ainda mais completa.",
        destaque: false
    },

    {
        id: 8,
        nome: "Topo Cenário",
        categoria: "topos",
        preco: 50.00,
        imagem: "",
        descricao: "Topo cenário personalizado para uma decoração completa e especial.",
        destaque: false
    }

];