variable "cluster_version" {
  type = string
  default = "1.21.2-do.2"
}

variable "worker_count" {
  type = number
  default = 3
}

variable "worker_size" {
  type = string
  default = "s-2vcpu-2gb"
}

variable "cluster_name" {
  type = string
  default = "ezticketing"
}

variable "cluster_region" {
  type = string
  default = "sfo3"
}

variable "do_token" {}

