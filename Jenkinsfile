pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository from GitHub...'
                git branch: 'main', url: 'https://github.com/HashirBaloch-123/todo-app.git'
            }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                sh '/usr/local/bin/docker-compose -f docker-compose-jenkins.yml down --remove-orphans || true'
                sh '/usr/local/bin/docker-compose -f docker-compose-jenkins.yml up -d --build'
            }
        }
        stage('Verify') {
            steps {
                sh 'docker ps'
            }
        }
    }
    post {
        success { echo 'Build successful!' }
        failure { echo 'Build failed.' }
    }
}
