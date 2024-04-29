<template>
    <div>
      <div class="task-list">
        <div class="task" v-for="task in tasks" :key="task.id">
          <span>TASK{{ task.id }}</span>
          <span>{{ getStatusText(task.quantization_status) }}</span>
          <span>{{ formatDate(task.created_at) }}</span>
          <button class="btn btn-danger w-30" @click="jumpToTask(task.id)">Jump</button>
        </div>
      </div>
      <button class="createBtn btn btn-success w-50" @click="createAndNavigateToTask">Create My Task</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        tasks: []
      };
    },
    methods: {
      async fetchTasks() {
        try {
          const response = await axios.get('/task/list/');
          this.tasks = response.data.data;
        //   alert(this.tasks);
        } catch (error) {
          console.error('An error occurred while fetching the tasks:', error);
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      },

    //   jumpToTask(id) {
    //     // window.open(`/task/retrieve/?id=${id}`, '_blank');
    //     this.$router.push(`/uploadImg/?id=${id}`);
    //   },
        jumpToTask(id) {
            this.$router.push({ name: 'Upload', query: { id } });
        },
      
        getStatusText(status) {
            switch (status) {
                case 10:
                return 'Success';
                case 1:
                return 'Running';
                case -1:
                return 'Failed';
                case 0:
                default:
                return 'Not Started';
            }
        },
    //   createAndUploadTask() {
    //     this.$router.push('/uploadImg');
    //    }
        async createAndNavigateToTask() {
            try {
                const response = await axios.get('/task/create/');
                const newTask = response.data.data;
                this.$router.push({ name: 'Upload', query: { id: newTask.id } });
            } catch (error) {
                console.error('Error creating task:', error.response || error);
            }
        },

    },
    created() {
      this.fetchTasks();
    }
  }
  </script>
  
  <style scoped>
    .task-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 70px;
    }
    
    .task {
        display: flex;
        justify-content: space-around;
        width: 100%;
        padding: 10px;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
    }
    
    .createBtn {
        margin-left: 400px;
        margin-bottom: 10px;
    }


  </style>
  