import React,{useEffect,useState} from 'react'
import api from '../../config/axiosConfig';

import { showToast } from '../../utils/toastNotifications';

export default function ListDesProduitSettings() {
    const [Page, setPage] = useState({
        title: '',
        subTitle: '',
        _id:''
    });

    const [images, setImages] = useState([]);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
const token=localStorage.getItem('token');




const fetchPageList=async()=>{
try{
    const response =await api.get("/settings/productpage");
    setPage(
     response.data

    );
    setImage(response.data.imagePath)


}
catch (error){
}
}

useEffect(()=>{
    fetchPageList();

},[])
const handlerInputChange=async(e)=>{
    e.preventDefault();

 try{

    const response= await api.put('/settings/productpage', {...Page})
    showToast("success in updating Product List Page ",'success')
    fetchPageList()
 }
      catch(err){
        alert(err)
      }
   
}

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPage((prevPage) => ({
        ...prevPage,
        [name]: value
    }));
};

const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const imagePath=image;

    try {
      if(imagePath!==null)
      {  await api.delete(`/upload/delete-image/productPage/${Page._id}`, {
            data: { imagePath: imagePath }
          });}

          const response=   await api.post(`/upload/add/productPage/${Page._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
setImage(response.data.file)

showToast("success in updating Product List Page ",'success')
} catch (error) {
console.log(error)    }
  };

  return (
    <div>
    {/* <!-- Titre de la page --> */}
    <div class="my-3 h-12 px-10 flex items-center justify-between">
        <h1 class="font-medium text-2xl text-gray-800">Page des Produits</h1>
    </div>

    <div class="flex flex-col mx-3 mt-6 lg:flex-row">
        {/* <!-- Formulaire pour créer ou mettre à jour À propos de nous --> */}
        <div class="w-full lg:w-full xl:w-full m-1">
            <form onSubmit={handlerInputChange} class="w-full bg-white shadow-md rounded-lg p-6">
                <div class="flex flex-wrap -mx-3 mb-6">
                    {/* <!-- Nom de l'entreprise --> */}
                    <div class="w-full px-3 mb-6">
                        <label class="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2" for="company_name"> Titre</label>
                        <input 
                         onChange={handleInputChange}
                        name='title'
                        value={Page.title}
                        placeholder="Titre de page des produit"
                        className="bg-white border border-blue-200 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-200 hover:border-blue-200 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>

                    {/* <!-- Description de l'usine --> */}
                    <div class="w-full px-3 mb-6">
                        <label class="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2" for="factory_description">Sous Titre</label>
                        <textarea rows="4" 
                        value={Page.subTitle}
                        onChange={handleInputChange}
                        className="appearance-none block w-full bg-white text-gray-900 text-sm border border-blue-200 rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-blue-200 hover:border-blue-200"
                        name="subTitle" 
                        placeholder="Sous titre" required></textarea>
                    </div>


             

                 

                    {/* <!-- Bouton de soumission --> */}
                    <div class="w-full px-3 mb-6">
                        <button 
                        class="text-blue-700 flex hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-800 dark:focus:ring-blue-800"
                        >Enregistrer les modifications</button>
                    </div>
                </div>
            </form>




            <form className="w-full bg-white shadow-md rounded-lg p-6 flex items-center justify-center mt-[10px]">
      {/* <!-- Téléchargement d'image --> */}
      <div className="w-full px-3">
        <label
          className="cursor-pointer flex w-full max-w-lg flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-400 bg-white p-6 text-center"
          htmlFor="dropzone-file"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide">
            Télécharger l'image
          </h2>
          <p className="mt-2 text-gray-500 tracking-wide">
            Téléchargez ou glissez-déposez votre fichier image (SVG, PNG, JPG, GIF).
          </p>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            name="imagePath"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileInputChange}
          />
        </label>
        {preview && (
          <div id="image-preview" className="mt-4">
            <img src={preview} alt="Image preview" className="max-w-full h-auto rounded-md" />
          </div>
        )}
      </div>
    </form>
        </div>
    </div>
</div>
  )
}
