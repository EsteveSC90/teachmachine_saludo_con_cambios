async function createModel() {
    // const checkpointURL = "https://estevesc90.github.io/teachablemachine_voice_saludo//modelo/model.json"; // Ruta server
    // const metadataURL = "https://estevesc90.github.io/teachablemachine_voice_saludo//modelo/metadata.json"; // Ruta server

    const checkpointURL = "http://localhost/teachmachine3/modelo/model.json"; // Ruta local
    const metadataURL = "http://localhost/teachmachine3/modelo/metadata.json"; // Ruta local

    const recognizer = speechCommands.create(
        "BROWSER_FFT",
        undefined,
        checkpointURL,
        metadataURL
    );

    await recognizer.ensureModelLoaded();
    return recognizer;
}

// async function init() {
//     const recognizer = await createModel();
//     const classLabels = recognizer.wordLabels(); // Obtener etiquetas del modelo
//     const labelContainer = document.getElementById("label-container");

//     labelContainer.innerHTML = ""; // Limpiar el contenido previo
//     classLabels.forEach(() => labelContainer.appendChild(document.createElement("div")));

//     recognizer.listen(result => {
//         result.scores.forEach((score, i) => {
//             labelContainer.childNodes[i].innerText = `${classLabels[i]}: ${score.toFixed(2)}`;
//         });
//     }, {
//         probabilityThreshold: 0.75,
//         invokeCallbackOnNoiseAndUnknown: true,
//         overlapFactor: 0.5
//     });

//     // Detener la escucha después de 5 segundos
//     setTimeout(() => recognizer.stopListening(), 5000);
// }

async function init() {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels();
    const labelContainer = document.getElementById("label-container");

    labelContainer.innerHTML = "";
    classLabels.forEach(() => labelContainer.appendChild(document.createElement("div")));

    recognizer.listen(result => {
        result.scores.forEach((score, i) => {
            labelContainer.childNodes[i].innerText = `${classLabels[i]}: ${score.toFixed(2)}`;
        });

        const bestIndex = result.scores.indexOf(Math.max(...result.scores));
        const recognizedWord = classLabels[bestIndex];
        const confidence = result.scores[bestIndex];

        console.log(confidence)

        if (recognizedWord === "hola" && confidence > 0.92) {
            alert("Hola! Com puc ajudar-te?");
        }

        if (recognizedWord === "adeu" && confidence > 0.96) {
            window.location.href = "https://www.google.com";
        }
    }, {
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.5
    });

    // ***ELIMINAR O COMENTAR ESTA LÍNEA PARA ESCUCHA CONTINUA***
    // setTimeout(() => recognizer.stopListening(), 5000); 
}