variable "bucket" {
  type = string
}

variable "dns" {
  type = string
}

variable "certificate" {
  type = string
}

variable "test" {
  type    = string
  default = "http://localhost:3000"
}
