pipeline {
    environment {
        majorVersion = '0'
        minorVersion = '0'
        version = "${majorVersion}.${minorVersion}.${BUILD_NUMBER}"
        harborURL = 'harbor.abcdavid.top'
        projectName = 'e_catalogue'
        gatewayTag = "${harborURL}/${projectName}/gateway:${version}"
        usersmsTag = "${harborURL}/${projectName}/usersms:${version}"
        userinfomsTag = "${harborURL}/${projectName}/userinfoms:${version}"
        productmsTag = "${harborURL}/${projectName}/productms:${version}"
        contactmsTag = "${harborURL}/${projectName}/contactms:${version}"
        ordermsTag = "${harborURL}/${projectName}/orderms:${version}"
        fileserverTag = "${harborURL}/${projectName}/fileserver:${version}"
    }

    agent {
        kubernetes {
            yaml  '''
                  apiVersion: v1
                  kind: Pod
                  spec:
                    containers:
                    - name: dind
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
            defaultContainer 'dind'
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

        stage('Build') {

            parallel {
                stage('Build api-gateway') {
                    steps {
                        echo 'Building api-gateway...'
                        sh 'docker build -t ${gatewayTag} ./Gateway --platform linux/amd64'
                    }
                }

                stage('Build users microservice') {
                    steps {
                        echo 'Building users microservice...'
                        sh 'docker build -t ${usersmsTag} ./UsersMS --platform linux/amd64'
                    }
                }

                stage('Build user info microservice') {
                    steps {
                        echo 'Building user info microservice...'
                        sh 'docker build -t ${userinfomsTag} ./UserInfoMS --platform linux/amd64'
                    }
                }

                stage('Build product microservice') {
                    steps {
                        echo 'Building product microservice...'
                        sh 'docker build -t ${productmsTag} ./ProductMS --platform linux/amd64'
                    }
                }
                
                stage('Build contact microservice') {
                    steps {
                        echo 'Building contact microservice...'
                        sh 'docker build -t ${contactmsTag} ./ContactMS --platform linux/amd64'
                    }
                }

                stage('Build order microservice') {
                    steps {
                        echo 'Building order microservice...'
                        sh 'docker build -t ${ordermsTag} ./OrderMS --platform linux/amd64'
                    }
                }

                stage('Build fileserver') {
                    steps {
                        echo 'Building fileserver...'
                        sh 'docker build -t ${fileserverTag} ./FileServer --platform linux/amd64'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                echo 'To be implemented...'
            }
        }

        stage('Push to Harbor') {
            parallel {
                stage('Push api-gateway image to Harbor') {
                    steps {
                        echo 'Pushing api-gateway image to Harbor...'
                        sh 'docker push ${gatewayTag}'
                    }
                }

                stage('Push users microservice image to Harbor') {
                    steps {
                        echo 'Pushing users microservice image to Harbor...'
                        sh 'docker push ${usersmsTag}'
                    }
                }

                stage('Push user info microservice image to Harbor') {
                    steps {
                        echo 'Pushing user info microservice image to Harbor...'
                        sh 'docker push ${userinfomsTag}'
                    }
                }

                stage('Push product microservice image to Harbor') {
                    steps {
                        echo 'Pushing product microservice image to Harbor...'
                        sh 'docker push ${productmsTag}'
                    }
                }

                stage('Push contact microservice image to Harbor') {
                    steps {
                        echo 'Pushing contact microservice image to Harbor...'
                        sh 'docker push ${contactmsTag}'
                    }
                }

                stage('Push order microservice image to Harbor') {
                    steps {
                        echo 'Pushing order microservice image to Harbor...'
                        sh 'docker push ${ordermsTag}'
                    }
                }

                stage('Push fileserver image to Harbor') {
                    steps {
                        echo 'Pushing fileserver image to Harbor...'
                        sh 'docker push ${fileserverTag}'
                    }
                }
            }
        }

        stage('Trigger manifest update') {
          steps {
              echo 'Triggering manifest update...'
              build job: 'E-catalogue Kubernetes manifests updater', parameters: [string(name: 'IMAGE_VERSION', value: env.version)]
          }
        }
        
    }
}