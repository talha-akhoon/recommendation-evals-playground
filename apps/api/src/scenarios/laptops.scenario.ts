import type { Scenario } from '../types/eval.types.js';

export const laptopsScenario: Scenario = {
  id: 'dev-laptops',
  name: 'Laptop for a developer who travels frequently',
  description:
    'Choose a laptop for a software developer who travels frequently and works across coding, video calls, and light data work.',
  options: [
    {
      id: 'macbook-pro',
      name: 'MacBook Pro M4',
      evidence: [
        {
          id: 'macbook_spec_001',
          text: 'The MacBook Pro M4 delivers up to 24 hours of battery life and strong performance per watt. macOS is widely preferred by developers and creative professionals.',
        },
        {
          id: 'macbook_spec_002',
          text: 'The MacBook Pro M4 is not user-upgradeable. RAM and storage are soldered at purchase. UK pricing starts at £1,799 for the base 14-inch model.',
        },
        {
          id: 'macbook_review_001',
          text: 'The MacBook Pro has a strong ecosystem of developer and creative tools. Integration with iPhone, iPad, and other Apple devices is seamless.',
        },
        {
          id: 'macbook_review_002',
          text: 'The MacBook Pro provides two Thunderbolt 4 ports, one HDMI, one SD card slot, and MagSafe charging. There are no USB-A ports; an adapter is required for legacy peripherals.',
        },
      ],
    },
    {
      id: 'thinkpad-x1-carbon',
      name: 'ThinkPad X1 Carbon',
      evidence: [
        {
          id: 'thinkpad_spec_001',
          text: 'The ThinkPad X1 Carbon weighs 1.12 kg, making it one of the lightest 14-inch business laptops available. The keyboard is widely regarded as best-in-class for extended typing.',
        },
        {
          id: 'thinkpad_spec_002',
          text: 'The ThinkPad X1 Carbon includes USB-A, USB-C, Thunderbolt 4, full-size HDMI, and a headphone jack out of the box without requiring adapters.',
        },
        {
          id: 'thinkpad_review_001',
          text: 'ThinkPad build quality is MIL-SPEC tested for drops, temperature, humidity, and vibration. The keyboard and trackpoint design have remained consistent across generations.',
        },
        {
          id: 'thinkpad_review_002',
          text: 'The ThinkPad X1 Carbon display is functional but not best-in-class. The base IPS panel averages 400 nits brightness with mediocre colour accuracy compared to the XPS or MacBook.',
        },
      ],
    },
    {
      id: 'dell-xps-15',
      name: 'Dell XPS 15',
      evidence: [
        {
          id: 'xps_spec_001',
          text: 'The Dell XPS 15 has a 15.6-inch OLED display option with 100% DCI-P3 colour coverage and 400 nits peak brightness. It supports up to 64 GB RAM and includes a discrete Nvidia GeForce GPU.',
        },
        {
          id: 'xps_spec_002',
          text: 'The Dell XPS 15 weighs approximately 1.86 kg, making it the heaviest of the three. Ports include Thunderbolt 4, USB-A, and an SD card slot.',
        },
        {
          id: 'xps_review_001',
          text: 'The XPS 15 struggles with thermal management under sustained workloads. Fan noise is noticeable during long compile jobs or video exports.',
        },
        {
          id: 'xps_review_002',
          text: 'The XPS 15 is the only option with a discrete GPU, making it the strongest choice for tasks that benefit from dedicated graphics such as ML model training, 3D rendering, or gaming.',
        },
      ],
    },
  ],
};
