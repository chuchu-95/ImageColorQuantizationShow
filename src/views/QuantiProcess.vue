<template>
    <div class="container">
      <div class="image-section">
        <h2>Original Image</h2>
        <img :src="originalImageUrl" alt="Original Image" class="image"/>
        <button class="btn btn-secondary" @click="downloadImage($refs.originalImage, 'original.jpg')">Download Original</button>

      </div>
  
      <div class="image-section">
        <h2>Quantized Image</h2>
        <div v-if="loadingQuantizedImage" class="loading-container">
          <img src="../assets/load.gif" alt="Loading..." class="loading-image"/>
        </div>
        <div v-else class="quantizedImage">
          <img :src="quantizedImageUrl" alt="Quantized Image" class="image"/>
          <!-- <button class="btn btn-secondary" @click="downloadImage(quantizedImageUrl, 'quantized')">Download Quantized</button>
          <button class="btn btn-secondary" @click="showDetails">Details</button> -->
            <div class="btn-group" role="group" aria-label="Quantized Image Actions">
            <button class="btn btn-secondary" @click="downloadImage($refs.quantizedImage, 'quantized.jpg')">Download Quantized</button>
            <button class="btn btn-secondary" @click="showDetails">Details</button>
            </div>
        </div>
      </div>
      

      <div v-if="showModal" class="modal" tabindex="-1" role="dialog">
          
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <span class="close" @click="showModal = false">&times;</span>
            <div class="modal-header">
              <h5 class="modal-title">Quantization Details</h5>
            </div>
            <div class="modal-body">
              <dl class="row">
                <dt class="col-sm-4">Task ID:</dt>
                <dd class="col-sm-8">{{ quantizationDetails.task }}</dd>
                
                <dt class="col-sm-4">Start Time:</dt>
                <dd class="col-sm-8">{{ quantizationDetails.start_time }}</dd>
                
                <dt class="col-sm-4">End Time:</dt>
                <dd class="col-sm-8">{{ quantizationDetails.end_time }}</dd>
                
                <dt class="col-sm-4">K Value:</dt>
                <dd class="col-sm-8">{{ quantizationDetails.k }}</dd>
                
                <dt class="col-sm-4">Method:</dt>
                <dd class="col-sm-8">{{ quantizationDetails.method }}</dd>

                <div class="color-section">
                  <h5>Colors</h5>
                  <div class="color-container">
                    <div
                      class="color-block"
                      v-for="(color, index) in quantizationDetails.colors_list"
                      :key="index"
                      :style="`background-color: rgb(${color[0]}, ${color[1]}, ${color[2]})`"
                    ></div>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        imageId: null, // no use
        quantizationId: null, // to be set from incoming data or route query
        generationId: null,
        originalImageUrl: '',
        quantizedImageUrl: '',
        showModal: false,
        loadingQuantizedImage: true,
        quantizationDetails: null
      };
    },
    methods: {
        async fetchOriginalImage() {
            try {
                const response = await axios.get('/image/retrieve/', {
                params: { 
                  image_id: this.imageId 
                }
            });
            this.originalImageUrl = response.data.url; // Assume response contains image URL
            } catch (error) {
              console.error('Error fetching original image:', error);
            }
        },
        async fetchQuantizedImage() {
            try {
                const res = await axios.get('/quantization/retrieve/');
                this.generation_id = res.data.data.id;
                const response = await axios.get('/generation/download/', {
                    params: { 
                      generation_id: this.generationId 
                    },
                    responseType: 'blob'
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                this.quantizedImageUrl = url;
            } catch (error) {
                console.error('Error fetching quantized image:', error);
            }
        },

        async showDetails() {
          this.showModal = true;
          try {
                const response = await axios.get('/quantization/retrieve/', {
                    params: { 
                      quantization_id: this.quantizationId 
                    },
                });
                this.quantizationDetails = response.data.data;
            } catch (error) {
                console.error('Error fetching quantized image:', error);
            }
        },
        downloadImage(image, filename) {
          // Create an anchor element and trigger download
          const link = document.createElement('a');
          link.href = image.src; // Use the 'src' from the image element
          link.download = filename || 'download.jpg'; // Provide a default filename if not specified
          document.body.appendChild(link);
          link.click(); // Trigger the download
          document.body.removeChild(link); // Clean up
        }
    },
    created() {
      this.imageId = this.$route.query.imageId;
      this.quantizationId = this.$route.query.quantizationId;
      // Simulate fetch call for original image
      this.fetchOriginalImage();
      
      this.loadingQuantizedImage = false;
      // Simulate fetch call for quantized image
      this.fetchQuantizedImage();
    }
  };
  </script>
  
<style scoped>
    .container {
      display: flex;
      justify-content: space-around;
      padding: 50px 0;
    }
  
    .image-section {
      width: 45%;
      text-align: center;
    }
  
    .loading-container {
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .loading-image {
      width: 100px;
    }
  
    .image {
      max-width: 100%;
      max-height: 300px;
    }
  
    .modal {
      display: block;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgb(0,0,0);
      background-color: rgba(0,0,0,0.4);
    }
  
    .modal-content {
      background-color: #fefefe;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
    }
  
    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
  
    .close:hover,
    .close:focus {
      color: black;
      cursor: pointer;
    }
    .btn{
        margin-top: 10px;
    }

    .color-section {
      margin-top: 30px;
      margin-bottom: 30px; /* Added for spacing after the blocks */
    }

    .color-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start; /* Align blocks to the start of the container */
      max-width: 420px; /* Adjust this based on the total width of four blocks and margin */
    }

    .color-block {
      width: 80px; /* Adjust the width of the blocks */
      height: 80px; /* Adjust the height of the blocks */
      margin: 10px; /* Adjust the space between blocks */
      border: 2px solid #000; /* Adjust the border as needed */
      box-sizing: border-box; /* Include padding and borders in the total width and height */
    }
</style>
  