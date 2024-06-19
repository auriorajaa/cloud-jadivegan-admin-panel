// Import fungsi yang dibutuhkan dan dipakai
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage, uploadBytes, getDownloadURL, ref as storageRef, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
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
            window.location.href = document.getElementById('explore-page-link').href;
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
            if (snapshot.exists()) {
                const recipeData = snapshot.val();

                document.getElementById("dish-image").src = recipeData.RecipeImage;
                document.getElementById("recipe-title").innerText = recipeData.RecipeTitle;
                document.getElementById("recipe-category").innerText = recipeData.RecipeCategory;
                document.getElementById("recipe-servings").innerText = recipeData.RecipeServings + " Servings";
                document.getElementById("recipe-ingredients").innerText = recipeData.RecipeIngredients;
                document.getElementById("recipe-instructions").innerText = recipeData.RecipeInstructions;
                document.getElementById("recipe-tips").innerText = recipeData.RecipeTips;

                // Mendapatkan elemen Edit This Recipe di navbar
                const editRecipeLink = document.querySelector("#edit-recipe");

                // Merubah href dari tag di navbar menjadi URL yang diinginkan
                if (editRecipeLink) {
                    editRecipeLink.href = `/pages/edit-recipe-form?uid=${uid}`;
                }
            } else {
                console.log("No data available for this recipe");
            }
        }).catch((error) => {
            console.log("Error getting data: " + error);
        });
    } else {
        console.log("No UID available for this recipe");
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
            recipeCard.className = `itemBox ${recipeData.RecipeCategory.toLowerCase()} flex justify-center text-center py - 2`;

            // Menampilkan elemen HTML
            recipeCard.innerHTML = `
        <a href="/pages/recipe-detail?uid=${uid}" class="block w-80">
            <div
                class="card-recipe bg-white border border-gray-50 rounded-md hover:scale-105 transition-transform duration-500">
                <img class="custom-image w-full h-56 object-cover rounded-t-md"
                    src="${recipeData.RecipeImage}"
                    alt="${recipeData.RecipeTitle}" />
                <div class="p-4 font-sans">
                    <!-- Menggunakan break-words untuk membungkus teks panjang -->
                    <h1 class="text-lg font-bold text-gray-800 break-words">${recipeData.RecipeTitle}</h1>
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
        </a>
            `;

            // Menambahkan elemen HTML ke dalam div parents
            displayRecipeContainer.appendChild(recipeCard);
        }
    }, (errorObject) => {
        console.log("Error getting data: " + errorObject.code);
    });
});

// PROSES MENAMPILKAN DATA RESEP SAAT INI UNTUK DIGANTI DI HALAMAN EDIT RESEP
document.addEventListener("DOMContentLoaded", () => {
    // Membuat fungsi untuk mendapatkan query dari URL
    function getQueryParam(param) {
        // Menyimpan URL saat ini ke dalam variabel
        const urlParams = new URLSearchParams(window.location.search);

        // Memberikan value dari function getQueryParam menjadi URL yang sedang dibuka
        return urlParams.get(param);
    }

    // Mendapatkan UID dari URL
    const uid = getQueryParam("uid");

    // Membuat variabel untuk mendapatkan bagian input dari HTML
    const displayCurrentDishImage = document.querySelector("#display-dish-image");
    const recipeUIDInput = document.querySelector("#recipe-uid");
    const recipeTitleInput = document.querySelector("#recipe-title-input");
    const recipeServingsInput = document.querySelector("#recipe-servings-input");
    const recipeCategoryInput = document.querySelector("#recipe-category-input");
    const recipeIngredientsInput = document.querySelector("#recipe-ingredients-input");
    const recipeInstructionsInput = document.querySelector("#recipe-instructions-input");
    const recipeTipsInput = document.querySelector("#recipe-tips-input");
    const viewRecipeButton = document.querySelector("#view-recipe");

    // Variabel untuk mendapatkan bagian input gambar makanan
    const recipeImageInput = document.querySelector("#dish-image");

    // Membuat variabel untuk mendapatkan tombol update resep dan tombol delete resep
    const updateRecipeButton = document.querySelector("#update-recipe-btn");
    const deleteRecipeButton = document.querySelector("#delete-recipe-btn");

    // Pengkondisian untuk menampilkan resep yang sedang dibuka berdasarkan UID nya
    if (uid) {
        // Mendapatkan referensi resep berdasarkan UID di dalam tabel Recipes
        const recipeRef = databaseRef(db, `Recipes/${uid}`);

        // Fungsi bawaan Firebase untuk mendapatkan data
        get(recipeRef).then((snapshot) => {
            // Pengkondisian untuk menampilkan resep jika UID yang diinginkan ada di tabel
            if (snapshot.exists()) {
                // Mengambil data resep dari database
                const recipeData = snapshot.val();

                displayCurrentDishImage.src = recipeData.RecipeImage;
                viewRecipeButton.href = `@{/pages/recipe-detail?uid=${uid}}`;

                recipeUIDInput.value = uid;
                recipeTitleInput.value = recipeData.RecipeTitle;
                recipeCategoryInput.value = recipeData.RecipeCategory;
                recipeServingsInput.value = recipeData.RecipeServings;
                recipeIngredientsInput.value = recipeData.RecipeIngredients;
                recipeInstructionsInput.value = recipeData.RecipeInstructions;
                recipeTipsInput.value = recipeData.RecipeTips;
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.log("Error getting data: ", error);
        });
    } else {
        console.log("No UID provided");
    }

    function updateRecipe() {
        // Mendapatkan file gambar yang diunggah, jika ada
        const imageFile = recipeImageInput.files[0];

        // Membuat referensi ke data resep di Firebase
        const recipeRef = databaseRef(db, `Recipes/${recipeUIDInput.value}`);

        // Fungsi untuk mengupdate data di database
        function updateRecipeData(imageURL) {
            update(recipeRef, {
                RecipeTitle: recipeTitleInput.value,
                RecipeCategory: recipeCategoryInput.value,
                RecipeServings: recipeServingsInput.value,
                RecipeIngredients: recipeIngredientsInput.value,
                RecipeInstructions: recipeInstructionsInput.value,
                RecipeTips: recipeTipsInput.value,
                RecipeImage: imageURL || displayCurrentDishImage.src // Gunakan URL baru atau URL yang sudah ada
            }).then(() => {
                alert("Recipe updated successfully!");
                window.location.reload();
            }).catch((error) => {
                console.error("Error updating recipe: ", error);
            });
        }

        // Jika ada gambar baru, unggah ke Firebase Storage
        if (imageFile) {
            const storageImageRef = storageRef(storage, `Images/${imageFile.name}`);
            uploadBytes(storageImageRef, imageFile).then(() => {
                return getDownloadURL(storageImageRef);
            }).then((imageURL) => {
                updateRecipeData(imageURL);
            }).catch((error) => {
                console.error("Error uploading image: ", error);
            });
        } else {
            // Jika tidak ada gambar baru, langsung perbarui data
            updateRecipeData();
        }
    }

    // Menambahkan event listener ke tombol update
    updateRecipeButton.addEventListener("click", (event) => {
        event.preventDefault();
        updateRecipe();
    });

    // Fungsi untuk menghapus resep
    function deleteRecipe() {
        // Ambil referensi ke data resep yang akan dihapus
        const recipeRef = databaseRef(db, "Recipes/" + recipeUIDInput.value);

        // Ambil data resep terlebih dahulu untuk mendapatkan URL gambar
        get(recipeRef).then((snapshot) => {
            if (snapshot.exists()) {
                const recipeData = snapshot.val();
                const imageURL = recipeData.RecipeImage;

                // Hapus data resep dari database
                remove(recipeRef).then(() => {
                    alert("Recipe deleted successfully!");

                    // Jika gambar ada, hapus dari Firebase Storage
                    if (imageURL) {
                        // Ekstrak nama file dari URL gambar
                        const imageName = decodeURIComponent(imageURL.split('/o/')[1].split('?')[0]);

                        // Referensi ke gambar di Firebase Storage
                        const storageImageRef = storageRef(storage, imageName);

                        // Hapus gambar dari Firebase Storage
                        deleteObject(storageImageRef).then(() => {
                            console.log("Image deleted successfully from storage.");
                        }).catch((error) => {
                            console.error("Error deleting image from storage: ", error);
                        });
                    }

                    window.location.href = document.getElementById('reload-page-after-delete-or-edit-recipe').href;
                }).catch((error) => {
                    console.error("Error deleting recipe: ", error);
                    alert("Failed to delete recipe. Please try again.");
                });
            } else {
                console.log("No data available for the given UID.");
                alert("Recipe not found. Please check the UID.");
            }
        }).catch((error) => {
            console.error("Error retrieving recipe: ", error);
        });
    }

    // Tambahkan event listener ke tombol delete
    deleteRecipeButton.addEventListener("click", (event) => {
        event.preventDefault();
        const confirmDelete = confirm("Are you sure you want to delete this recipe?");
        if (confirmDelete) {
            deleteRecipe();
        }
    });
})