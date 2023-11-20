pipeline {
    environment {
        majorVersion = '0'
        minorVersion = '0'
    }

    agent {
        kubernetes {
            yaml  '''
                  apiVersion: v1
                  kind: Pod
                  spec:
                    containers:
                    - name: shell
                      image: ubuntu
                      command:
                      - sleep
                      args:
                      - infinity
                    - name: dockerindocker
                      image: docker
                      command:
                      - sleep
                      args:
                      - infinity
                  '''
            defaultContainer 'dockerindocker'
        }
    }
    stages {
        stage('Login to Harbor') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'harbor-account', passwordVariable: 'HARBOR_PASSWORD', usernameVariable: 'HARBOR_USERNAME')]) {
                    sh 'echo $HARBOR_PASSWORD | docker login https://harbor.abcdavid.top --username $HARBOR_USERNAME --password-stdin'
                }
            }
        }
        stage('Define variable') {
            steps {
                sh 'export version="${majorVersion}.${minorVersion}.${BUILD_NUMBER}"'
                sh 'export harborURL="harbor.abcdavid.top"'
                sh 'export projectName="library"'

                sh 'export gatewayTag="${harborURL}/${projectName}/gateway:${version}"'
                echo 'gatewayTag: ${gatewayTag}'
                sh 'export usersmsTag="${harborURL}/${projectName}/usersms:${version}"'
            }
        }
        stage('Build') {
            steps {
                echo 'Listing files...'
                sh 'ls -al'
                echo 'Building docker images...'

                echo 'gatewayTag: ${gatewayTag}'

                echo 'Building api-gateway...'
                sh 'docker build -t ${gatewayTag} ./Gateway'

                echo 'Building users microservice...'
                sh 'docker build -t ${usersms} ./UsersMS'
            }
        }
        stage('Test') {
            steps {
                echo 'To be implemented...'
            }
        }
        stage('Push to Harbor') {
            steps {
                echo 'Pushing api-gateway image to Harbor...'
                sh 'docker push ${gatewayTag}'

                echo 'Pushing users microservice image to Harbor...'
                sh 'docker push ${usersmsTag}'
            }
        }
    }
}