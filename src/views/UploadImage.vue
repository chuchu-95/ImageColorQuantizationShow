<template>
    <div class="container">
        <div class="upload-section">
        <h3 class="title">Upload Image</h3>
        <input type="file" @change="uploadImage" ref="fileInput" style="display: none;" />
        <button @click="clickUploadButton" class="btn btn-primary">Upload</button>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-if="imageData">
            <img :src="imagePreview" alt="Image Preview" class="image-preview" />
            <div class="image-parameters">
            <p>Pixel count: {{ imageData.pixel_count }}</p>
            <p>Color count: {{ imageData.color_count }}</p>
            <p>Width: {{ imageData.width }}</p>
            <p>Height: {{ imageData.height }}</p>
            <p>Image Type: {{ imageData.image_type }}</p>
            </div>
        </div>
        </div>
        <div class="quantization-section">
            <div v-if="imageData" class="quantization-form">
                <h3 class="title">Quantization:</h3>
                <div class="form-group row">
                    <label for="quantization-method" class="col-sm-4 col-form-label">Method:</label>
                    <div class="col-sm-8">
                        <select id="quantization-method" v-model="quantizationMethod" class="form-control" @change="updateInputFields">
                            <option value="kMeans">kMeans</option>
                            <option value="BisectingKMeans">BisectingKMeans</option>
                            <option value="GaussianMixture">GaussianMixture</option>
                        </select>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="final-color-k" class="col-sm-7 col-form-label">The final color number k:</label>
                    <div class="col-sm-5">
                        <input id="final-color-k" type="number" v-model="kValue" class="form-control" placeholder="Enter k value" />
                    </div>
                </div>
                <div v-if="quantizationMethod === 'kMeans'" class="additional-fields">
                    <div class="form-group row">
                        <label for="max-iterations" class="col-sm-7 col-form-label">Maximum Iteration Number:</label>
                        <div class="col-sm-5">
                            <input id="max-iterations" type="number" v-model="maxIterations" class="form-control" placeholder="3" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="tolerance" class="col-sm-7 col-form-label">Maximum Tolerance:</label>
                        <div class="col-sm-5">
                            <input id="tolerance" type="number" v-model="tolerance" class="form-control" placeholder="0.0001" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="initialization-steps" class="col-sm-7 col-form-label">Initialization Steps:</label>
                        <div class="col-sm-5">
                            <input id="initialization-steps" type="number" v-model="initializationSteps" class="form-control" placeholder="2" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="distance-metric" class="col-sm-7 col-form-label">Distance Metric:</label>
                        <div class="col-sm-5">
                            <select id="distance-metric" v-model="distanceMetric" class="form-control">
                                <option value="euclidean">Euclidean</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div v-if="quantizationMethod === 'BisectingKMeans'" class="additional-fields">
                    <div class="form-group row">
                        <label for="max-iterations" class="col-sm-7 col-form-label">Maximum Iteration Number:</label>
                        <div class="col-sm-5">
                            <input id="max-iterations" type="number" v-model="maxIterations" class="form-control" placeholder="3" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="min-cluster-size" class="col-sm-7 col-form-label">Min Divisible Cluster Size:</label>
                        <div class="col-sm-5">
                            <input id="min-cluster-size" type="number" v-model="minClusterSize" class="form-control" placeholder="1.0" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="distance-metric" class="col-sm-7 col-form-label">Distance Metric:</label>
                        <div class="col-sm-5">
                            <select id="distance-metric" v-model="distanceMetric" class="form-control">
                                <option value="euclidean">Euclidean</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div v-if="quantizationMethod === 'GaussianMixture'" class="additional-fields">
                    <div class="form-group row">
                        <label for="max-iterations" class="col-sm-7 col-form-label">Maximum Iteration Number:</label>
                        <div class="col-sm-5">
                            <input id="max-iterations" type="number" v-model="maxIterations" class="form-control" placeholder="3" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="tolerance" class="col-sm-7 col-form-label">Maximum Tolerance:</label>
                        <div class="col-sm-5">
                            <input id="tolerance" type="number" v-model="tolerance" class="form-control" placeholder="0.0001" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="aggregation-depth" class="col-sm-7 col-form-label">Aggregation Depth:</label>
                        <div class="col-sm-5">
                            <input id="aggregation-depth" type="number" v-model="aggregationDepth" class="form-control" placeholder="2" />
                        </div>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-8 offset-sm-4">
                        <button @click="startQuantization" class="btn btn-primary">Start Quantization!</button>
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
            taskID: null,
            imageData: null,
            imagePreview: '',
            quantizationMethod: 'kMeans',
            kValue: null,
            maxIterations: null,
            loading: false,
            base64Image: null, 
        };
    },
    methods: {
        clickUploadButton() {
            this.$refs.fileInput.click();
        },
        async uploadImage(event) {
            const file = event.target.files[0];
            if (!file) {
                console.error('No file selected for upload.');
                return;
            }
            this.imagePreview = URL.createObjectURL(file);
            this.loading = true;
            
            const formData = new FormData();
            formData.append('task_id', this.taskID); 
            formData.append('image', file); 

            try {
                const response = await axios.post('/image/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
                });
                this.imageData = response.data.data;
                this.loading = false;
            } catch (error) {
                console.error('Error uploading image:', error.response || error);
                this.loading = false;
            }
        },


        handleImageUploadSuccess(response) {
            this.imageData = response.data.data;

            const reader = new FileReader();
            reader.onload = (e) => {
            this.base64Image = e.target.result;
            localStorage.setItem('uploadedImage', this.base64Image);
            };
            reader.readAsDataURL(this.imageData.image_file); 
        },


        async startQuantization() {
            if (!this.kValue || this.kValue <= 0 || !this.maxIterations || this.maxIterations <= 0) {
                alert('Please enter valid values for k and maximum iterations.');
                return;
            }

            const quantizationData = {
                task_id: this.taskID,
                method: this.quantizationMethod,
                k: this.kValue,
                arg1: this.maxIterations,
            };

            try {
                const response = await axios.post('/quantization/execute/', quantizationData);
                this.$router.push({ name: 'Quanti', params: { 
                    quantizationId: response.data.quantization_id,
                    imageId: this.imageData.id
                } 
                });
            } catch (error) {
                console.error('Error starting quantization:', error.response || error);
            }
        }

    },
    created() {
        if (this.$route.query.id) {
            this.taskID = this.$route.query.id;
        } else {
        // Handle error or redirection if task ID is not present
        }
    }
    };
</script>

<style scoped>
    .container {    
    display: flex;
    justify-content: space-around;
    max-width: 100%;
    }

    .upload-section, .quantization-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px;
        flex-basis: 45%;
    }

    .quantization-section{
        margin-top: 100px;
    }

    .title {
        font-weight: bold;

    }

    .image-preview {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
    }

    .loading {
    margin: 10px;
    font-weight: bold;
    }

    .image-parameters p, .quantization-form h2, .quantization-form select, .quantization-form input, .btn-primary {
    margin-bottom: 10px;
    }

    .btn-primary {
    cursor: pointer;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    }

    .btn-primary:hover {
    background-color: #0056b3;
    }
</style>


  