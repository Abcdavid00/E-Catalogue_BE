# diagram.py
from diagrams import Diagram, Cluster
from diagrams.generic.device import Mobile
from diagrams.saas.cdn import Cloudflare
from diagrams.custom import Custom
from diagrams.onprem.certificates import CertManager
from diagrams.onprem.ci import Jenkins
from diagrams.onprem.vcs import Github
from diagrams.programming.framework import React
from diagrams.programming.language import Go
from diagrams.onprem.registry import Harbor
from diagrams.onprem.container import Docker
from diagrams.onprem.gitops import ArgoCD
from diagrams.onprem.database import MySQL
from diagrams.onprem.network import Traefik
from diagrams.k8s.storage import PV, PVC, SC
from diagrams.k8s.compute import Pod, Deploy
from diagrams.k8s.network import SVC, Ing
from diagrams.k8s.podconfig import Secret, CM

with Diagram('SystemArchitecture', show=False, graph_attr={'fontsize': '40'}):
    client = React('Client')
    cloudflare = Cloudflare('Cloudflare')
    github = Github('Github')

    
    
    with Cluster('Kubernetes', graph_attr={'bgcolor': 'transparent'}):
        traefik = Traefik('Traefik')
        certmanager = CertManager('Certmanager')
        
        argocd = ArgoCD('ArgoCD')
        
        with Cluster('Application'):
            ingress = Ing('Ingress')
            argocd >> ingress
            loadbalancer = SVC('Loadbalancer')
            gateway_deploy = Deploy('Gateway')
            argocd >> gateway_deploy
            configmaps = [
                CM('Configmap'),
                CM('Configmap'),
            ]
            argocd >> configmaps
            secrets = [
                Secret('Secret'),
                Secret('Secret')
            ]
            argocd >> secrets
            configmaps >> gateway_deploy
            secrets >> gateway_deploy
            with Cluster('Databases'):
                db_deploys = [
                    Deploy('MySQL'),
                    Deploy('MySQL'),
                ]
                argocd >> db_deploys
                services = [
                    SVC('MySQL'),
                    SVC('MySQL'),
                ]
                argocd >> services
                mysql = MySQL('MySQL')
                databases = [
                    Pod('MySQL'),
                    Pod('MySQL'),
                ]
                db_pvcs = [
                    PVC('MySQL'),
                    PVC('MySQL'),
                ]
                mysql >> databases
                services[0] >> databases[0]
                services[1] >> databases[1]
                db_deploys[0] >> databases[0]
                db_deploys[1] >> databases[1]
                databases[0] >> db_pvcs[0]
                databases[1] >> db_pvcs[1]
                configmaps[0] >> db_deploys
                secrets[0] >> db_deploys
            
            with Cluster('Microservices'):
                microservices = [
                    Deploy('Microservice'),
                    Deploy('Microservice'),
                ]
                argocd >> microservices
                services = [
                    SVC('Microservice'),
                    SVC('Microservice'),
                ]
                argocd >> services
                loadbalancer >> services
                pods = [
                    Pod('Microservice'),
                    Pod('Microservice'),
                ]
                microservices[0] >> pods[0]
                microservices[1] >> pods[1]
                services[0] >> pods[0]
                services[1] >> pods[1]
                configmaps[1] >> microservices
                secrets[0] >> microservices
                secrets[1] >> microservices
            
        longhorn = Custom('Longhorn', './SAResources/longhorn.png')
        storageclass = SC('Longhorn StorageClass')
        persistance_volumes = [
            PV('Persistent Volume'),
            PV('Persistent Volume'),
        ]
        persistance_volumes >> storageclass >> longhorn
        
        db_pvcs[0] >> persistance_volumes[0]
        db_pvcs[1] >> persistance_volumes[1]
        
        with Cluster('Jenkins', graph_attr={'bgcolor': 'transparent'}):
            jenkins_ab = Jenkins('Application Builder')
            jenkins_kmu = Jenkins('Kubernetes Manifest Updater')
            docker = Docker('Docker image')
            
            
        harbor = Harbor('Harbor')
    
    with Cluster('Source code'):
        sc = [Custom('Nest', './SAResources/nestjs.png'),
              Go('Go')]
        
    traefik >> certmanager
    client >> cloudflare >> traefik >> ingress >> loadbalancer >> gateway_deploy
    sc >> github >> jenkins_ab >> docker >> harbor >> argocd
    jenkins_ab >> jenkins_kmu >> argocd