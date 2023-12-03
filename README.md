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

