class AdminPanel {
    constructor() {
        this.uploadForm = document.getElementById('uploadForm');
        this.photosGrid = document.getElementById('photosGrid');
        this.init();
    }

    init() {
        this.loadPhotos();
        this.uploadForm.addEventListener('submit', (e) => this.handleUpload(e));
    }

    async loadPhotos() {
        try {
            const response = await fetch('/api/photos');
            const data = await response.json();
            this.renderPhotos(data.photos);
        } catch (error) {
            console.error('Ошибка загрузки фотографий:', error);
        }
    }

    async handleUpload(e) {
        e.preventDefault();
        const formData = new FormData();
        const fileInput = document.getElementById('photoInput');
        formData.append('file', fileInput.files[0]);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                this.loadPhotos(); // Перезагружаем список фото
                fileInput.value = ''; // Очищаем input
            }
        } catch (error) {
            console.error('Ошибка загрузки файла:', error);
        }
    }

    async deletePhoto(filename) {
        if (confirm('Вы уверены, что хотите удалить это фото?')) {
            try {
                const response = await fetch(`/api/photos/${filename}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (data.success) {
                    this.loadPhotos(); // Перезагружаем список фото
                }
            } catch (error) {
                console.error('Ошибка удаления файла:', error);
            }
        }
    }

    renderPhotos(photos) {
        this.photosGrid.innerHTML = photos.map(photo => `
            <div class="photo-item">
                <img src="/images/${photo}" alt="${photo}">
                <button class="delete-btn" onclick="adminPanel.deletePhoto('${photo}')">×</button>
            </div>
        `).join('');
    }
}

const adminPanel = new AdminPanel(); 