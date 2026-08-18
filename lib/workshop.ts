/**
 * The Edge AI workshop — the single programme this site sells.
 *
 * Everything on the page is generated from this file. Edit here, not in the
 * components. Content marked REVIEW is my best guess and needs your sign-off.
 */

export type Module = {
  title: string;
  points: string[];
};

export type Batch = {
  /** ISO date of day one, e.g. "2026-09-12" */
  startsOn: string;
  /** Human-readable cadence */
  cadence: string;
  /** Where it runs — venue name or "Online" */
  where: string;
  seats: number;
  seatsLeft: number;
};

export const workshop = {
  slug: "edge-ai",
  title: "Edge AI",
  subtitle: "Run real models on real hardware, offline and in milliseconds",
  level: "Beginner to intermediate", // REVIEW
  format: "In person on campus, or live online", // REVIEW
  hours: 16, // REVIEW
  sessions: 4, // REVIEW
  days: 2, // REVIEW
  priceInr: 0, // 0 hides pricing; set a number to show it. REVIEW

  summary:
    "Cloud inference is easy to demo and expensive to live with. Edge AI is the other path: a model small enough and fast enough to run on the device in front of you. No round trip, no bandwidth bill, no data leaving the room. Over two days you take a trained model, shrink it, and get it running on real hardware you can hold.",

  /** Short pitch used in the hero and meta description. */
  blurb:
    "A hands-on workshop on running machine-learning models directly on devices: microcontrollers, single-board computers, and edge accelerators.",

  whyItMatters: [
    {
      title: "Latency you cannot buy",
      body: "A round trip to a data centre costs you 50–300 ms before the model even starts. On-device inference answers in single-digit milliseconds. For anything touching a camera, a motor, or a person, that gap decides whether the product works.",
    },
    {
      title: "Data that never leaves",
      body: "The cheapest way to solve a privacy problem is to not transmit the data. Edge inference keeps video, audio, and sensor streams on the device, which turns a compliance conversation into an architecture diagram.",
    },
    {
      title: "Costs that do not scale with usage",
      body: "Cloud inference bills per call, forever. Hardware is bought once. At any real deployment size the economics stop being close.",
    },
    {
      title: "It works when the network does not",
      body: "Factory floors, farms, vehicles, and most of rural India do not have reliable connectivity. A model on the device does not care.",
    },
  ],

  outcomes: [
    "Explain honestly when Edge AI is the right answer, and when a cloud API is simply better",
    "Take a trained model and cut it down with quantization and pruning without wrecking its accuracy",
    "Convert and deploy a model to TensorFlow Lite / LiteRT and ONNX Runtime",
    "Get a vision model running on a Raspberry Pi and a keyword-spotting model on a microcontroller",
    "Measure what actually matters on device: latency, memory footprint, and power draw",
    "Leave with a working demo on hardware and the code that produced it",
  ],

  curriculum: [
    {
      title: "Session 1: What runs where",
      points: [
        "The edge hardware landscape: microcontrollers, Raspberry Pi, Jetson, NPUs, and accelerators",
        "Reading a datasheet for what matters: RAM, flash, clock, and thermal headroom",
        "The decision framework: when the cloud wins and you should say so",
        "Setting up the toolchain and flashing your first board",
      ],
    },
    {
      title: "Session 2: Making models small",
      points: [
        "Where the size actually goes: parameters, activations, and runtime overhead",
        "Post-training quantization vs quantization-aware training",
        "Pruning and knowledge distillation, and the accuracy you pay for each",
        "Measuring the trade-off instead of guessing at it",
      ],
    },
    {
      title: "Session 3: Vision on a single-board computer",
      points: [
        "Converting to TensorFlow Lite / LiteRT and ONNX Runtime",
        "Running MobileNet and a small YOLO variant on a Raspberry Pi",
        "Camera pipelines, pre-processing cost, and the frame budget",
        "Profiling latency and finding where the milliseconds went",
      ],
    },
    {
      title: "Session 4: TinyML on a microcontroller, and shipping it",
      points: [
        "Keyword spotting on an MCU with TFLite Micro",
        "Fitting a model into kilobytes of RAM",
        "Power measurement and duty cycling for battery life",
        "Over-the-air updates and monitoring a model you cannot SSH into",
        "Capstone: your model, your board, running in front of the room",
      ],
    },
  ] satisfies Module[],

  forWhom: [
    "Students from any engineering branch: CSE, IT, ECE, EE or ME",
    "Anyone who has trained a model in a notebook but never deployed one",
    "Embedded, instrumentation and IoT people adding ML to hardware they already build",
    "Faculty and lab teams setting up an Edge AI practical",
  ],

  prerequisites: [
    "Basic Python, enough to read and modify a script. If you have only done C, you will keep up",
    "No machine-learning background needed; we build it from the ground up",
    "No electronics background needed either. The boards are explained from scratch",
    "Open to every branch. Second year onward is the usual sweet spot",
    "A laptop; we provide the boards and sensors during the workshop", // REVIEW
  ],

  /** Hardware learners get their hands on. REVIEW — set to what you actually provide. */
  hardware: [
    "Raspberry Pi with camera module",
    "ESP32-class microcontroller",
    "Edge accelerator (Coral / Jetson class)",
    "Assorted sensors for the capstone",
  ],

  batches: [] as Batch[], // REVIEW — add dates and they appear on the page automatically
};

export type Workshop = typeof workshop;

export type Branch = {
  code: string;
  name: string;
  /** The hook — why this branch should care, in one line. */
  hook: string;
  /** What they specifically get out of the two days. */
  body: string;
  /** A capstone they could plausibly walk out with. */
  project: string;
};

/**
 * Edge AI sits at the junction of software, electronics, power and machines,
 * so it is genuinely a cross-branch subject. This section exists so a student
 * from any department can find themselves on the page instead of assuming it
 * is a computer-science event.
 */
export const branches: Branch[] = [
  {
    code: "CSE",
    name: "Computer Science",
    hook: "The model you trained, made small enough to ship.",
    body: "You already know how to train. This is the half that decides whether it ever reaches a user: quantization, pruning, inference runtimes, and the profiling that tells you where the milliseconds went.",
    project: "A vision model quantized 4× and benchmarked on a Raspberry Pi",
  },
  {
    code: "IT",
    name: "Information Technology",
    hook: "The architecture around a thousand devices you cannot SSH into.",
    body: "Edge inference changes the system design, not just the model: what stays local, what syncs, how updates roll out safely, and how you keep sensor data from ever leaving the building.",
    project: "A device that infers locally and syncs only summaries upstream",
  },
  {
    code: "ECE",
    name: "Electronics & Communication",
    hook: "Your home ground. Inference on a microcontroller.",
    body: "Everything you know about embedded systems, sensors and signal processing applies directly. We go down to TinyML on an MCU: fitting a model into kilobytes and feeding it clean, well-conditioned signals.",
    project: "Keyword spotting running on an ESP32 in a few hundred KB",
  },
  {
    code: "EE",
    name: "Electrical Engineering",
    hook: "Inference measured in milliwatts, not just milliseconds.",
    body: "On a battery, power is the real constraint. We measure current draw, duty-cycle the inference loop, and look at where hardware acceleration actually pays for itself against its own power cost.",
    project: "Fault detection on motor current, running within a battery budget",
  },
  {
    code: "ME",
    name: "Mechanical Engineering",
    hook: "Machines that notice their own bearings failing.",
    body: "Predictive maintenance is the flagship Edge AI application, and it is mechanical at heart. Vibration and acoustic signatures, caught on the machine itself, before the failure reaches the shop floor.",
    project: "A vibration-based anomaly detector mounted on a rotating machine",
  },
];

export type Instructor = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  /** e.g. "/images/team/aarav.jpg" — falls back to initials when null */
  photo: string | null;
};

/** REVIEW — replace with the people who actually teach this. */
export const instructors: Instructor[] = [
  {
    slug: "instructor-one",
    name: "Instructor Name",
    role: "Edge AI Lead, Verikon",
    bio: "Replace this bio with the real one. Two sentences on what they build professionally and why they are the person teaching this.",
    initials: "IN",
    photo: null,
  },
  {
    slug: "instructor-two",
    name: "Instructor Name",
    role: "Engineer, Verikon",
    bio: "Replace this bio with the real one. Two sentences on what they build professionally and why they are the person teaching this.",
    initials: "IN",
    photo: null,
  },
];

export type Venue = {
  slug: string;
  name: string;
  city: string;
  /** e.g. "March 2026" — when the workshop ran there */
  when: string;
  /** Rough attendance, or null to hide it */
  attendees: number | null;
  blurb: string;
  /** Drop files in public/images/venues/ and list them here */
  photos: string[];
};

/**
 * Where the workshop has actually run.
 * Photos: put files in `public/images/venues/` and reference them as
 * "/images/venues/<file>". Empty arrays render a labelled placeholder.
 */
export const venues: Venue[] = [
  {
    slug: "mmmut-gorakhpur",
    name: "MMMUT Gorakhpur",
    city: "Gorakhpur, Uttar Pradesh",
    when: "2026", // REVIEW — month and year
    attendees: null, // REVIEW
    blurb:
      "A hands-on Edge AI session with students at Madan Mohan Malaviya University of Technology, working through model compression and on-device deployment on real boards.",
    photos: [],
  },
  {
    // REVIEW — I expanded "Dayal Bagh Agra" to the institute's full name.
    // Shorten to "Dayalbagh, Agra" if you ran it somewhere other than DEI.
    slug: "dei-dayalbagh-agra",
    name: "Dayalbagh Educational Institute",
    city: "Dayalbagh, Agra, Uttar Pradesh",
    when: "2026", // REVIEW — month and year
    attendees: null, // REVIEW
    blurb:
      "A hands-on Edge AI session at DEI Dayalbagh, taking students from a trained model through quantization to inference running on boards on the desk.",
    photos: [],
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Slug of the venue where they attended */
  venue: string;
  initials: string;
  /** Drop files in public/images/testimonials/ — falls back to initials when null */
  photo: string | null;
};

/** REVIEW — these are placeholders. Replace with real quotes and photos. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "I had trained models in a notebook before, but seeing one actually run on a board I was holding changed how I think about the whole field.",
    name: "Student name",
    role: "B.Tech, Computer Science",
    venue: "mmmut-gorakhpur",
    initials: "SN",
    photo: null,
  },
  {
    quote:
      "The quantization session was the part I did not expect. We cut the model down by a factor of four and it still worked, and I understood why.",
    name: "Student name",
    role: "B.Tech, Electronics",
    venue: "mmmut-gorakhpur",
    initials: "SN",
    photo: null,
  },
  {
    quote:
      "Two days, and every one of us left with something running on hardware. That is not how most workshops end.",
    name: "Student name",
    role: "B.Tech, Electrical Engineering",
    venue: "dei-dayalbagh-agra",
    initials: "SN",
    photo: null,
  },
];

export const venueBySlug = (slug: string) => venues.find((v) => v.slug === slug);

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatPrice = (amount: number) => inrFormatter.format(amount);

/** "12 September 2026" — identical on server and client. */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
