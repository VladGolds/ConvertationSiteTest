// Инициализация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCsk6CNDHMBKFTN5xYngxewYmeBgovhFHE",
  authDomain: "convertation-93b17.firebaseapp.com",
  databaseURL: "https://convertation-93b17-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "convertation-93b17",
  storageBucket: "convertation-93b17.appspot.com",
  messagingSenderId: "1035022201443",
  appId: "1:1035022201443:web:3565c42d45f94d4c5cfe56"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();

document.getElementById('convertBtn').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput').files[0];
    if (!fileInput) {
        alert('Please select a file first');
        return;
    }

    // Загрузка файла в Firebase Storage
    const storageRef = storage.ref(`uploads/${fileInput.name}`);
    const uploadTask = storageRef.put(fileInput);

    uploadTask.on('state_changed', 
        function(snapshot) {
            // Отслеживание состояния загрузки
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, 
        function(error) {
            console.log('Error uploading file:', error);
        }, 
        function() {
            // Успешная загрузка
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                document.getElementById('output').innerHTML = `<a href="${downloadURL}" target="_blank">Download Converted File</a>`;
                
                // Сохранение ссылки в Firestore
                db.collection('convertedFiles').add({
                    fileName: fileInput.name,
                    downloadURL: downloadURL,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        }
    );
});
