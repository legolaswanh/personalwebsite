const base = '/images/research/telemedicine-mirror/case-study';

export const telemedicineMirrorCaseStudyImages = {
  designMethods: `${base}/design-methods.png`,
  personaJourney: `${base}/persona-journey.png`,
  evaluation: `${base}/evaluation.png`,
} as const;

export const telemedicineMirrorDesignMethods = [
  {
    number: '01',
    title: 'Four Ws',
    body: 'Used to identify who uses telemedicine, in what context, and where trust breaks down.',
  },
  {
    number: '02',
    title: 'How Might We (HMW)',
    body: 'Used to turn trust issues in telemedicine into clear design opportunities.',
  },
  {
    number: '03',
    title: 'Mind Map',
    body: 'Used to connect medical needs, technologies, and system components into one coherent concept.',
  },
  {
    number: '04',
    title: 'Persona & User Journey Map',
    body: 'Used to map how a patient experiences diagnosis, decision-making, and trust at home.',
  },
  {
    number: '05',
    title: 'Sketching',
    body: 'Used to explore and refine the form and interactions of the medical mirror.',
  },
  {
    number: '06',
    title: 'Survey (Qualitative Analysis)',
    body: 'Used to evaluate transparency, usability, and perceived trust in the system.',
  },
] as const;
