terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.82"
    }
  }

  required_version = ">= 1.2.0"

  backend "s3" {
    encrypt        = false
    region         = "us-east-1"
    bucket         = "310209471386-us-east-1-tfstate"
    dynamodb_table = "310209471386-us-east-1-tfstate-lock"
    key            = "brendanberg/lobbyart.org"
  }
}

provider "aws" {
  region = "us-east-2"

  default_tags {
    tags = {
      "Repository" = "brendanberg/lobbyart.org"
    }
  }
}
