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
        id: 9,
        nome: "Kit Festa",
        categoria: "kits",
        tipoConfiguracao: "kit-festa",
        preco: 252.00,
        imagem: "",
        descricao: "Kit Festa com bolo, doces comuns e salgados fritos. Topo de bolo cobrado à parte.",
        destaque: true,

        kitsFesta: [
            { id: "kit1", nome: "Kit 1", preco: 252, serve: 10, boloKg: 1, doces: 50, salgados: 100 },
            { id: "kit2", nome: "Kit 2", preco: 347, serve: 15, boloKg: 1.5, doces: 50, salgados: 150 },
            { id: "kit3", nome: "Kit 3", preco: 500, serve: 20, boloKg: 2, doces: 100, salgados: 200 },
            { id: "kit4", nome: "Kit 4", preco: 732, serve: 30, boloKg: 3, doces: 150, salgados: 300 },
            { id: "kit5", nome: "Kit 5", preco: 975, serve: 40, boloKg: 4, doces: 200, salgados: 400 },
            { id: "kit6", nome: "Kit 6", preco: 1227, serve: 50, boloKg: 5, doces: 250, salgados: 500 }
        ],

        massas: ["Branca", "Chocolate"],

        recheiosBolo: [
            "4 Leites", "Bicho de pé", "Creme Ninho", "Doce de leite", "Brigadeiro",
            "Prestígio", "Sonho de Oreo", "Dois amores", "Olho de sogra"
        ],

        saboresDoces: ["Brigadeiro", "Beijinho", "Moranguinho", "Cajuzinho", "Olho de Sogra"],

        saboresSalgados: ["Coxinha", "Bolinho de Queijo", "Maravilha", "Croquete de Carne"]
    },

    {
        id: 3,
        nome: "Docinhos",
        categoria: "doces",

        preco: 30.00,

        imagem: "",

        descricao:
            "Docinhos artesanais em forminha de papel. Aproximadamente 18g cada doce.",

        destaque: true,

        quantidadeMinima: 25,
        intervaloQuantidade: 25,

        regrasSabores: [
            {
                quantidadeMinima: 25,
                quantidadeMaxima: 25,
                maxSabores: 1
            },
            {
                quantidadeMinima: 50,
                quantidadeMaxima: 75,
                maxSabores: 2
            },
            {
                quantidadeMinima: 100,
                quantidadeMaxima: 175,
                maxSabores: 4
            },
            {
                quantidadeMinima: 200,
                quantidadeMaxima: null,
                maxSabores: 6
            }
        ],

        linhasDoces: {

            comum: {
                nome: "Linha Comum",
                precoCento: 120,

                sabores: [
                    "Brigadeiro",
                    "Beijinho",
                    "Moranguinho",
                    "Cajuzinho",
                    "Olho de Sogra"
                ]
            },

            gourmet: {
                nome: "Linha Gourmet",
                precoCento: 230,

                sabores: [
                    "Ao Leite",
                    "Bicho de Pé",
                    "Churros",
                    "Branco",
                    "Doce de Leite com Coco",
                    "Paçoca",
                    "Stikadinho"
                ]
            },

            premium: {
                nome: "Linha Premium",
                precoCento: 280,

                sabores: [
                    "Ferrero",
                    "Surpresa de Uva",
                    "Ao Leite com Nutella",
                    "Ninho com Nutella",
                    "Oreo + Bolachinha"
                ]
            }

        }
    },

    {
        id: 4,
        nome: "Salgados",
        categoria: "salgados",
        preco: 15.00,
        imagem: "",
        descricao: "Salgados fritos ou congelados pelo mesmo valor. Escolha a linha, a quantidade e os sabores.",
        destaque: false,
        quantidadeMinima: 25,
        intervaloQuantidade: 25,
        regrasSabores: [
            { quantidadeMinima: 25, quantidadeMaxima: 25, maxSabores: 1 },
            { quantidadeMinima: 50, quantidadeMaxima: 75, maxSabores: 2 },
            { quantidadeMinima: 100, quantidadeMaxima: 175, maxSabores: 4 },
            { quantidadeMinima: 200, quantidadeMaxima: null, maxSabores: 6 }
        ],
        linhasSalgados: {
            mini: {
                nome: "Mini Salgados",
                precoCento: 60,
                sabores: ["Coxinha", "Bolinho de Queijo", "Croquete de Carne", "Maravilha"]
            },
            festa: {
                nome: "Salgados de Festa",
                precoCento: 110,
                sabores: ["Coxinha", "Bolinho de Queijo", "Croquete de Carne", "Maravilha", "Risoles de Carne", "Risoles de Calabresa", "Kibe", "Brócolis com Queijo"]
            },
            assados: {
                nome: "Salgados Assados",
                precoCento: 130,
                sabores: ["Esfirra de Carne", "Esfirra de Frango", "Esfirra de Calabresa", "Empada de Frango", "Empada de Palmito", "Mistinho de Presunto e Queijo", "Enroladinho de Salsicha"]
            }
        }
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