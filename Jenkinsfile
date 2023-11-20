pipeline {
    environment {
        majorVersion = '0'
        minorVersion = '0'
        version = "${majorVersion}.${minorVersion}.${BUILD_NUMBER}"
        harborURL = 'harbor.abcdavid.top'
        projectName = 'cicd_demo'
        gatewayTag = "${harborURL}/${projectName}/gateway:${version}"
        usersmsTag = "${harborURL}/${projectName}/usersms:${version}"
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
                      image: docker:latest
                      command:
                      - cat
                      tty: true
                      volumeMounts:
                      - mountPath: /var/run/docker.sock
                        name: docker-sock
                    volumes:
                    - name: docker-sock
                      hostPath:
                        path: /var/run/docker.sock   
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
        // stage('Define variable') {
        //     steps {
        //         export version="${majorVersion}.${minorVersion}.${BUILD_NUMBER}"
        //         export harborURL="harbor.abcdavid.top"
        //         export projectName="library"

        //         export gatewayTag="${harborURL}/${projectName}/gateway:${version}"
        //         echo 'gatewayTag: ${gatewayTag}'
        //         export usersmsTag="${harborURL}/${projectName}/usersms:${version}"
        //     }
        // }
        stage('Build') {
            steps {
                echo 'Listing files...'
                sh 'ls -al'
                echo 'Building docker images...'

                echo 'gatewayTag: ${gatewayTag}'

                echo 'Building api-gateway...'
                sh 'docker build -t ${gatewayTag} ./Gateway --platform linux/amd64'

                echo 'Building users microservice...'
                sh 'docker build -t ${usersmsTag} ./UsersMS --platform linux/amd64'
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