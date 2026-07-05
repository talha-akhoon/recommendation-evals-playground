import type { Scenario } from '../types/eval.types.js';

export const cloudScenario: Scenario = {
  id: 'cloud-providers',
  name: 'Cloud provider for an ML-powered SaaS',
  description:
    'Choose a cloud provider for a new startup building an ML-powered web application.',
  options: [
    {
      id: 'aws',
      name: 'AWS',
      evidence: [
        {
          id: 'aws_spec_001',
          text: 'AWS offers over 200 cloud services across compute, storage, database, networking, and AI. It has the largest global infrastructure with 33 regions and 105 availability zones.',
        },
        {
          id: 'aws_spec_002',
          text: 'AWS pricing uses hundreds of SKUs and varies by region, instance type, and usage tier. Cost management requires dedicated tooling such as AWS Cost Explorer or third-party optimisers.',
        },
        {
          id: 'aws_review_001',
          text: 'AWS has the steepest learning curve of the three providers. IAM permission management and VPC networking configuration can take weeks for a new team to set up correctly.',
        },
        {
          id: 'aws_review_002',
          text: 'AWS has the largest third-party ecosystem with the most marketplace integrations, community resources, and available certifications.',
        },
      ],
    },
    {
      id: 'gcp',
      name: 'GCP',
      evidence: [
        {
          id: 'gcp_spec_001',
          text: 'Google Cloud is the leading platform for ML and AI workloads, offering TPUs, Vertex AI managed model training, and BigQuery, the most widely adopted managed data warehouse for analytics at scale.',
        },
        {
          id: 'gcp_spec_002',
          text: 'GCP spans 40+ regions and has the strongest managed Kubernetes offering. Kubernetes was developed at Google and GKE is considered the most mature managed Kubernetes service.',
        },
        {
          id: 'gcp_review_001',
          text: "GCP's service catalog is narrower than AWS, with fewer niche services. Enterprise support has historically trailed AWS but has improved significantly in recent years.",
        },
        {
          id: 'gcp_review_002',
          text: 'GCP pricing is generally simpler than AWS. Sustained use discounts are applied automatically without requiring upfront commitment or reserved instance purchases.',
        },
      ],
    },
    {
      id: 'azure',
      name: 'Azure',
      evidence: [
        {
          id: 'azure_spec_001',
          text: 'Azure integrates tightly with Microsoft enterprise products including Active Directory, Office 365, and Teams. It holds the strongest compliance certification portfolio for regulated industries such as healthcare and finance.',
        },
        {
          id: 'azure_spec_002',
          text: 'Azure is the dominant choice for organisations already running Windows Server, SQL Server, or .NET workloads, offering significant hybrid cloud and migration tooling.',
        },
        {
          id: 'azure_review_001',
          text: "Azure's developer experience outside the Microsoft ecosystem can be inconsistent. Documentation quality and API stability vary considerably across services.",
        },
        {
          id: 'azure_review_002',
          text: 'Azure holds over 60 compliance certifications, more than AWS or GCP, which is a key differentiator for government and regulated enterprise customers.',
        },
      ],
    },
  ],
};
