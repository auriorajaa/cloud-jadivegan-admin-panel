// Import fungsi yang dibutuhkan dan dipakai
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage, uploadBytes, getDownloadURL, ref as storageRef } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getDatabase, set, get, update, remove, push, ref as databaseRef, child, onValue, orderByChild } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA_j33k5Uj3p5ytcUjs6CRt-mqpEE5C_sI",
    authDomain: "cloud-jadivegan.firebaseapp.com",
    databaseURL: "https://cloud-jadivegan-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cloud-jadivegan",
    storageBucket: "cloud-jadivegan.appspot.com",
    messagingSenderId: "921107144471",
    appId: "1:921107144471:web:b51457db748516b1d12152",
    measurementId: "G-YMSJVP9QVB"
};

// Menginisialisasi Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Menginisialisasi Authentication
const auth = getAuth(app);

// Menginisialisasi Storage
const storage = getStorage(app);

// Menginisialisasi Database
const db = getDatabase();

// PROSES MEMBUAT AKUN (SIGN UP)
document.addEventListener("DOMContentLoaded", () => {
    // Menginisialisasi variabel untuk menarik data dari inputan
    const adminEmailForSignUp = document.querySelector("#admin-create-email");
    const adminPasswordForSignUp = document.querySelector("#admin-create-password");

    // Variabel untuk tombol signup
    const signUpBtn = document.querySelector("#signup-account-btn");

    // Membuat fungsi signup
    const userSignUp = async () => {
        // Mengambil nilai dari inputan dan memasukkannya ke variabel baru
        const signUpEmail = adminEmailForSignUp.value;
        const signUpPassword = adminPasswordForSignUp.value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
            const user = userCredential.user;
            alert("Account successfully created");
            window.location.reload();  // Refresh halaman setelah akun berhasil dibuat
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + errorMessage);
            alert("Error creating account: " + errorMessage);  // Menampilkan pesan error yang lebih informatif
        }
    };

    // Menjalankan fungsi userSignUp ketika tombol create account ditekan
    signUpBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Mencegah halaman untuk reload atau action default lainnya
        userSignUp();
    });
});

// PROSES MASUK AKUN (LOGIN)
document.addEventListener("DOMContentLoaded", () => {
    // Menginisialisasi variabel untuk menarik data dari inputan
    const adminEmailForLogin = document.querySelector("#admin-login-email");
    const adminPasswordForLogin = document.querySelector("#admin-login-password");

    // Variabel untuk tombol login
    const loginBtn = document.querySelector("#login-account-btn");

    // Membuat fungsi sign in
    const userSignIn = async () => {
        // Mengambil nilai dari inputan dan memasukkannya ke variabel baru
        const loginEmail = adminEmailForLogin.value;
        const loginPassword = adminPasswordForLogin.value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            const user = userCredential.user;
            alert("Account successfully logged in");
            window.location.href = "/src/main/resources/templates/pages/explore-page/index.html";
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + errorMessage);
            alert("Error logging in: " + errorMessage);
        }
    }

    // Menjalankan fungsi userSignIn ketika tombol login ditekan
    loginBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Mencegah halaman untuk reload atau action default lainnya
        userSignIn();
    });
});

// PROSES MEMBUAT RESEP
document.addEventListener("DOMContentLoaded", () => {
    // Mendapatkan elemen input
    const recipeTitleInput = document.querySelector("#recipe-title");
    const recipeServingsInput = document.querySelector("#recipe-servings");
    const recipeCategoryInput = document.querySelector("#recipe-category");
    const recipeIngredientsInput = document.querySelector("#recipe-ingredients");
    const recipeInstructionsInput = document.querySelector("#recipe-instructions");
    const recipeTipsInput = document.querySelector("#recipe-tips");
    const recipeImageInput = document.querySelector("#dish-image");

    // Tombol submit
    const createRecipeBtn = document.querySelector("#create-recipe-btn");

    // Inisialisasi fungsi untuk membuat resep
    const createRecipe = async () => {
        // Mendapatkan file gambar yang diunggah
        const imageFile = recipeImageInput.files[0];

        // Jika input tidak terisi maka tampilkan pesan error 
        if (!imageFile || !recipeTitleInput.value || !recipeServingsInput.value || !recipeCategoryInput.value || !recipeIngredientsInput.value || !recipeInstructionsInput.value || !recipeTipsInput.value) {
            alert("Please fill out all fields");
            return;
        }

        // Upload gambar ke Firebase Storage
        const storageReference = storageRef(storage, `Images/${imageFile.name}`);
        await uploadBytes(storageReference, imageFile);

        // Mendapatkan URL gambar yang diunggah
        const imageURL = await getDownloadURL(storageReference);

        // Menyimpan data resep ke Firebase Realtime Database
        await set(push(databaseRef(db, "Recipes")), {
            RecipeTitle: recipeTitleInput.value,
            RecipeServings: recipeServingsInput.value,
            RecipeCategory: recipeCategoryInput.value,
            RecipeIngredients: recipeIngredientsInput.value,
            RecipeInstructions: recipeInstructionsInput.value,
            RecipeTips: recipeTipsInput.value,
            RecipeImage: imageURL, // Menyimpan URL gambar
            CreatedAt: new Date().toISOString()
        })
            .then(() => {
                // Menampilkan pesan sukses
                alert("Recipe created successfully!");
                window.location.reload();
            })
            .catch((error) => {
                // Menampilkan pesan error
                alert("Error creating recipe: " + error);
            });
    };

    // Menjalankan fungsi createRecipe ketika tombol create recipe ditekan
    createRecipeBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Mencegah halaman untuk reload atau action default lainnya
        createRecipe();
    });
});

// PROSES MENAMPILKAN RESEP DI HALAMAN RESEP DETAIL
document.addEventListener("DOMContentLoaded", () => {

    // Membuat fungsi untuk mendapatkan query dari URL
    function getQueryParam(param) {
        // Menyimpan URL saat ini ke dalam variabel
        const urlParams = new URLSearchParams(window.location.search);

        // Memberikan value dari function getQueryParam menjadi URL yang sedang dibuka
        return urlParams.get(param);
    }

    // Menapatkan referensi UID Resep yang sedang dibuka dari URL
    const uid = getQueryParam("uid");

    // Pengkondisian untuk menampilkan resep yang sedang dibuka berdasarkan UID nya
    if (uid) {
        // Mendapatkan referensi resep berdasarkan UID di dalam tabel Recipes
        const recipeRef = databaseRef(db, `Recipes/${uid}`);

        // Fungsi bawaan Firebase untuk mendapatkan data
        get(recipeRef).then((snapshot) => {
            // Pengkondisian untuk menampilkan resep jika UID yang diinginkan ada di tabel
            if (snapshot.exist()) {
                const recipeData = snapshot.val();

                
            }
        })
    }
});

// PROSES MENAMPILKAN RESEP DI HALAMAN SEARCH
document.addEventListener("DOMContentLoaded", () => {
    // Mendapatkan referensi tabel yang diinginkan dari database
    const recipeRef = databaseRef(db, "Recipes");

    // Mendapatkan elemen HTML yang akan dimanipulasi
    const displayRecipeContainer = document.querySelector("#display-recipe");

    // Mendapatkan data resep untuk ditampilkan di halaman search resep
    onValue(recipeRef, (snapshot) => {
        // Mendapatkan data resep
        const data = snapshot.val();

        // Menghapus konten yang ada (untuk mencegah duplikasi)
        displayRecipeContainer.innerHTML = "";

        // Melakukan iterasi setiap entri di dalam data 
        for (const uid in data) {
            const recipeData = data[uid];

            const recipeCard = document.createElement("div");
            recipeCard.className = `itemBox ${recipeData.RecipeCategory.toLowerCase()} flex justify - center text - center py - 2`;

            // Menampilkan elemen HTML
            recipeCard.innerHTML = `
        < a href = "/src/main/resources/templates/pages/recipe-detail/index.html?uid=${uid}" class= "block w-80" >
        <div
            class="card-recipe bg-white border border-gray-50 rounded-md hover:scale-105 transition-transform duration-500">
            <img class="custom-image w-full h-56 object-cover rounded-t-md"
                src="${recipeData.RecipeImage}"
                alt="${recipeData.RecipeTitle}" />
            <div class="p-4 font-sans">
                <!-- Menggunakan break-words untuk membungkus teks panjang -->
                <h1 class="text-lg font-bold text-gray-800 break-words">${recipeData.RecipeTitle}</h1>
                <p clas="text-black">${uid}</p>
                <div class="flex flex-col mt-4">
                    <div class="flex justify-center gap-4 mb-4">
                        <span class="text-xs font-medium text-gray-600 items-center gap-1">
                            <i class="fa-solid fa-bowl-food" style="color: #656565;"></i>
                            ${recipeData.RecipeCategory}
                        </span>
                        <span class="text-xs font-medium text-gray-600 items-center gap-1">
                            <i class="fa-solid fa-utensils" style="color: #656565;"></i>
                            ${recipeData.RecipeServings} Serv
                        </span>
                    </div>
                    <button
                        class="border border-green-600 text-green-600 hover:bg-green-600 hover:underline text-sm font-semibold rounded-lg px-4 py-2 transition-colors duration-300">
                        Try recipe
                    </button>
                </div>
            </div>
        </div>
                    </a >
            `;

            // Menambahkan elemen HTML ke dalam div parents
            displayRecipeContainer.appendChild(recipeCard);
        }
    }, (errorObject) => {
        console.log("Error getting data: " + errorObject.code);
    });
});