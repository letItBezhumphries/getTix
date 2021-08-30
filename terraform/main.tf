terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = ">= 2.4.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}


resource "digitalocean_kubernetes_cluster" "ezh-ticketing" {
  name    = var.cluster_name
  region  = var.cluster_region
  version = var.cluster_version

  node_pool {
    name       = "default"
    size       = var.worker_size
    node_count = var.worker_count
  }
}