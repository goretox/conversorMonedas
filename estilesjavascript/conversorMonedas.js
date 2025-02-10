document.addEventListener("DOMContentLoaded", () => {
    const amountInput = document.getElementById("amount");
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");
    const convertBtn = document.getElementById("convertBtn");
    const resultText = document.getElementById("result");

    // API para obtener tasas de cambio
    const API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

    let exchangeRates = {}; // Almacena tasas de cambio

    // Obtener tasas de cambio al cargar la página
    async function fetchExchangeRates() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            // Filtrar solo las monedas necesarias y agregar USD manualmente
            exchangeRates = {
                "USD": 1, // La API no devuelve USD porque es la base, lo agregamos manualmente
                "ARS": data.rates.ARS,
                "BRL": data.rates.BRL,
                "CLP": data.rates.CLP,
                "EUR": data.rates.EUR,
                "MXN": data.rates.MXN
            };

            console.log("Tasas de cambio cargadas:", exchangeRates);
        } catch (error) {
            console.error("Error al obtener tasas de cambio", error);
            resultText.textContent = "Error al cargar tasas de cambio";
        }
    }

    // Función para convertir moneda
    function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        // Validaciones
        if (isNaN(amount) || amount <= 0) {
            resultText.textContent = "Por favor, ingresa una cantidad válida.";
            return;
        }

        if (from === to) {
            resultText.textContent = "Selecciona monedas diferentes para convertir.";
            return;
        }

        // Conversión de moneda
        const usdAmount = amount / exchangeRates[from]; // Convertir a USD
        const convertedAmount = usdAmount * exchangeRates[to]; // Convertir a la moneda deseada

        // Mostrar resultado
        resultText.textContent = `${amount} ${from} = ${convertedAmount.toFixed(2)} ${to}`;
    }

    // Función para manejar la exclusión dinámica en los selectores
    function updateSelectorExclusion(selectedSelector, targetSelector) {
        const selectedValue = selectedSelector.value;

        // Habilitar todas las opciones en el targetSelector
        Array.from(targetSelector.options).forEach(option => {
            option.disabled = false;
        });

        // Desactivar la opción seleccionada en el otro selector
        if (selectedValue) {
            const optionToDisable = Array.from(targetSelector.options).find(option => option.value === selectedValue);
            if (optionToDisable) optionToDisable.disabled = true;
        }
    }

    // Eventos para exclusión dinámica en el conversor de monedas
    fromCurrency.addEventListener('change', () => {
        updateSelectorExclusion(fromCurrency, toCurrency);
    });

    toCurrency.addEventListener('change', () => {
        updateSelectorExclusion(toCurrency, fromCurrency);
    });

    // Evento para convertir cuando se presiona el botón
    convertBtn.addEventListener("click", convertCurrency);

    // Cargar tasas de cambio al iniciar
    fetchExchangeRates();
});





