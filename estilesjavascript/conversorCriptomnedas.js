/*******************************
 * SECCIÓN 1: Variables Globales
 *******************************/

// URL de la API externa para criptomonedas
const cryptoApiURL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,ripple,cardano,solana,polkadot,litecoin,dogecoin&vs_currencies=usd";

// Almacenar tasas de cambio actualizadas
let cryptoRates = {};

// Referencias a los elementos del DOM
const cryptoFrom = document.getElementById("cryptoFrom");
const cryptoTo = document.getElementById("cryptoTo");
const cryptoAmount = document.getElementById("cryptoAmount");
const cryptoResult = document.getElementById("cryptoResult");

/***************************************
 * SECCIÓN 2: Función para Obtener Tasas
 ***************************************/

// Función para obtener las tasas de cambio de criptomonedas
async function fetchCryptoRates() {
    try {
        const response = await fetch(cryptoApiURL);
        const data = await response.json();
        cryptoRates = data;

        console.log("📊 Tasas de cambio de criptomonedas actualizadas:", cryptoRates); // Para depuración

    } catch (error) {
        console.error("❌ Error al obtener tasas de criptomonedas:", error);
        cryptoResult.textContent = "⚠ Error al cargar tasas de cambio.";
    }
}

/*******************************************
 * SECCIÓN 3: Exclusión Dinámica de Opciones
 *******************************************/

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

// Eventos para exclusión dinámica en el conversor de criptomonedas
cryptoFrom.addEventListener("change", () => {
    updateSelectorExclusion(cryptoFrom, cryptoTo);
});
cryptoTo.addEventListener("change", () => {
    updateSelectorExclusion(cryptoTo, cryptoFrom);
});

/************************************
 * SECCIÓN 4: Conversión de Criptomonedas
 ************************************/

// Función para realizar la conversión de criptomonedas
function convertCrypto() {
    const amount = parseFloat(cryptoAmount.value);
    const from = cryptoFrom.value;
    const to = cryptoTo.value;

    if (isNaN(amount) || amount <= 0) {
        cryptoResult.textContent = "⚠ Ingresa una cantidad válida.";
        return;
    }

    if (from === to) {
        cryptoResult.textContent = "⚠ Selecciona criptomonedas diferentes.";
        return;
    }

    if (!cryptoRates[from] || !cryptoRates[to]) {
        cryptoResult.textContent = "⚠ Tasa de cambio no disponible.";
        return;
    }

    // ✅ Nueva fórmula corregida
    const fromRate = cryptoRates[from].usd;
    const toRate = cryptoRates[to].usd;

    if (!fromRate || !toRate) {
        cryptoResult.textContent = "⚠ No se encontraron datos para la conversión.";
        return;
    }

    // Convertir desde la moneda de origen a USD y luego a la moneda destino
    const convertedAmount = ((amount * toRate) / fromRate).toFixed(8);

    cryptoResult.textContent = `💱 ${amount} ${from.toUpperCase()} = ${convertedAmount} ${to.toUpperCase()}`;
}

// Evento para realizar la conversión cuando se presiona el botón
document.getElementById("convertCrypto").addEventListener("click", convertCrypto);

/************************************
 * SECCIÓN 5: Inicialización del Script
 ************************************/

// Inicializar las tasas de cambio al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    fetchCryptoRates(); // Obtener tasas de cambio al cargar la página

    // Aplicar exclusión inicial
    updateSelectorExclusion(cryptoFrom, cryptoTo);
    updateSelectorExclusion(cryptoTo, cryptoFrom);
});

