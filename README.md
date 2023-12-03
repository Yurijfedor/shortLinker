# Serverless ShortLinker

Serverless ShortLinker is a serverless application that allows users to create and manage short links. It provides features such as link creation, deactivation, link statistics, and email notifications.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Notification Setup](#notification-setup)
- [Author](#author)

## Features

- Create new shortened links
- Deactivate previously created links
- Record link statistics on each visit
- List links created by the user with visit counts
- Link lifetime options: one-time link, 1 day, 3 days, 7 days
- Email notifications for link deactivation

## Architecture

Serverless ShortLinker is built using AWS serverless technologies, including:

- AWS Lambda for serverless functions
- Amazon DynamoDB for database storage
- Amazon SES for sending email notifications
- Amazon SQS for queuing email notifications
- AWS EventBridge for triggering events

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- AWS account with appropriate permissions
- AWS CLI configured on your local machine
- Node.js and npm installed
- Serverless Framework installed (`npm install -g serverless`)

## Getting Started

1. Clone this repository: `git clone https://github.com/your-repo/serverless-shortlinker.git`
2. Change to the project directory: `cd serverless-shortlinker`
3. Install dependencies: `npm install`
4. Configure your AWS credentials using `aws configure` if you haven't already.
5. Set up the required environment variables in AWS Secrets Manager:

- Create a secret named `MySecret` with the following key-value pairs:
  - `EMAIL_FROM`: Your email address (e.g., admin@gmail.com)
  - `AWS_ACCESS_KEY_ID`: Your AWS Access Key ID
  - `AWS_SECRET_ACCESS_KEY`: Your AWS Secret Access Key
  - `AWS_REGION`: AWS region (e.g., eu-central-1)

6. Create an Amazon S3 bucket with the name `myfirsttestbucket112` for deployment purposes.
7. Create an Amazon DynamoDB table with the name `links` for storing links data.
8. Create an Amazon DynamoDB table with the name `users` for storing user data.
9. Create an AWS IAM role with the name `user_register` and the necessary permissions for your Lambda functions.
10. To enable automatic link expiration and notifications, set up an Amazon SQS queue and an Amazon SES email configuration. Update the `sendNotificationToQueue` function with the correct `QUEUE_URL`.
11. Deploy the application again to apply the environment variable changes:
    serverless deploy -v

## Usage

- Deploy the application: `serverless deploy`
- Create a new shortened link: `serverless invoke -f createLink -d '{"url": "https://example.com", "lifetime": "1 day"}'`
- Deactivate a link: `serverless invoke -f deactivateLink -d '{"linkId": "your-link-id"}'`
- Record link visit: Trigger the link using a browser or HTTP client
- List user's links: `serverless invoke -f listLinks`

## Notification Setup

- To enable email notifications, set up Amazon SES and configure your sending domain.
- Create an SQS queue for notifications and update the `serverless.yml` file with the queue ARN.
- Set up an AWS Lambda function to process notifications from the SQS queue and send emails using Amazon SES.

## Author

Yriy Shaklak
