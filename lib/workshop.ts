/**
 * The Edge AI workshop — the single programme this site sells.
 *
 * Everything on the page is generated from this file. Edit here, not in the
 * components. Content marked REVIEW is my best guess and needs your sign-off.
 */

export type SessionItem = {
  session: string;
  title: string;
  duration: string;
  points: string[];
};

export type DayPlan = {
  dayNumber: number;
  dayTitle: string;
  subtitle: string;
  totalHours: string;
  sessions: SessionItem[];
};

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
  hours: 13,
  sessions: 7,
  days: 2,
  priceInr: 0, // 0 hides pricing; set a number to show it. REVIEW

  summary:
    "Cloud inference is easy to demo and expensive to scale. Edge AI is the other path: running real-time vision pipelines, local Small Language Models (1B–3B), and Vision-Language Models directly on edge GPU hardware like NVIDIA Jetson. Over two days, you take raw PyTorch/YOLO models, optimize them into TensorRT .engine files, deploy local GenAI with Ollama & llama.cpp, and assemble a complete Multimodal Edge Assistant.",

  /** Short pitch used in the hero and meta description. */
  blurb:
    "A hands-on workshop on NVIDIA Jetson architecture, YOLO vision pipelines, local Small Language Models (Llama 3.2, Qwen 2.5), TensorRT acceleration, and Multimodal AI.",

  whyItMatters: [
    {
      title: "Single-Digit Millisecond Latency",
      body: "A round trip to a cloud API costs 50–300 ms before inference even starts. On-device TensorRT execution on Jetson CUDA and Tensor Cores delivers instant results for real-time video and robotics.",
    },
    {
      title: "Private Local GenAI (1B–3B SLMs)",
      body: "Run lightweight models like Llama 3.2, Qwen 2.5, and Phi-3.5 locally using Ollama and llama.cpp with CUDA acceleration—zero API subscription costs and total data privacy.",
    },
    {
      title: "TensorRT Model Acceleration",
      body: "Convert standard PyTorch & ONNX models into FP16 and INT8 quantized TensorRT .engine files to unlock massive FPS gains on edge hardware.",
    },
    {
      title: "Vision + Language Intelligence",
      body: "Combine OpenCV video detection streams with Vision-Language Models (VLMs) and SLM reasoning to turn raw pixel data into actionable, structured alerts.",
    },
  ],

  outcomes: [
    "Inspect NVIDIA Jetson GPU memory and manage hardware power profiles using jtop and nvpmodel",
    "Build high-FPS OpenCV video pipelines with pre-trained YOLO object detection models",
    "Run local Small Language Models (1B–3B) using Ollama and llama.cpp with CUDA acceleration",
    "Quantize PyTorch/ONNX models into optimized TensorRT .engine files to maximize FPS",
    "Query video frames with natural language prompts using Vision-Language Models (VLMs)",
    "Assemble the Multimodal Edge Assistant capstone (Vision Detection → SLM Analysis → Structured Alert)",
  ],

  curriculum: [
    {
      dayNumber: 1,
      dayTitle: "Day 1: Edge Computing, Vision AI & Local Language Models",
      subtitle: "Foundations of Edge AI, GPU video pipelines, and local SLM inference.",
      totalHours: "6 Hours",
      sessions: [
        {
          session: "Session 1",
          title: "The Edge AI Landscape & Remote Setup",
          duration: "2 Hours",
          points: [
            "Why Edge AI? Balancing latency, bandwidth, privacy, and cloud costs.",
            "Hardware tour: NVIDIA Jetson architecture (CUDA Cores, Tensor Cores, Unified Memory).",
            "Connecting to cloud-hosted Jetson environments; inspecting memory with jtop and managing power modes (nvpmodel).",
          ],
        },
        {
          session: "Session 2",
          title: "Computer Vision & Object Detection",
          duration: "2 Hours",
          points: [
            "Processing video streams using OpenCV pipelines.",
            "Running pre-trained YOLO object detection models on the Jetson GPU.",
            "Measuring baseline performance: Latency, FPS, and RAM consumption.",
          ],
        },
        {
          session: "Session 3",
          title: "Small Language Models (SLMs) on the Edge",
          duration: "2 Hours",
          points: [
            "Introduction to Edge GenAI: Running 1B–3B parameter models locally (Llama 3.2, Qwen 2.5, Phi-3.5).",
            "Setting up lightweight runtimes (Ollama / llama.cpp with CUDA acceleration).",
            "Writing Python wrappers to prompt local models for automated log generation and decision-making.",
          ],
        },
      ],
    },
    {
      dayNumber: 2,
      dayTitle: "Day 2: Hardware Acceleration, Multimodal AI & Capstone Project",
      subtitle: "NVIDIA TensorRT acceleration, Vision-Language Models, and guided capstone build.",
      totalHours: "6.5 Hours",
      sessions: [
        {
          session: "Session 1",
          title: "Model Optimization with NVIDIA TensorRT",
          duration: "2 Hours",
          points: [
            "Why standard PyTorch models choke on edge devices.",
            "Quantization explained: Moving from FP32 to FP16 and INT8 precision.",
            "Hands-on Lab: Converting PyTorch/ONNX models into optimized TensorRT .engine files to boost FPS.",
          ],
        },
        {
          session: "Session 2",
          title: "Multimodal AI & Vision-Language Models",
          duration: "1.5 Hours",
          points: [
            "Combining vision and language: Introduction to Vision-Language Models (VLMs) on Jetson.",
            "Querying video frames with natural language prompts (e.g., \"Is the worker wearing safety gear?\").",
          ],
        },
        {
          session: "Session 3",
          title: "Guided Capstone Build",
          duration: "2.5 Hours",
          points: [
            "Group Project: Assemble the Multimodal Edge Assistant (Vision Detection → SLM Analysis → Structured Alert).",
            "Testing, benchmarking performance gains (PyTorch vs. TensorRT), and Q&A.",
          ],
        },
        {
          session: "Session 4",
          title: "Wrap-Up & Career Pathways",
          duration: "0.5 Hours",
          points: [
            "Showcase of student projects, GitHub setup guidance, and industry applications in robotics/IoT.",
          ],
        },
      ],
    },
  ] satisfies DayPlan[],

  forWhom: [
    "Students from any engineering branch: CSE, IT, ECE, EE or ME",
    "Anyone who wants to deploy local LLMs/SLMs, YOLO, and TensorRT on edge GPUs",
    "Embedded, AI, and robotics enthusiasts building real-time vision and hardware intelligence",
    "Faculty and lab teams setting up Edge AI and GenAI practical labs",
  ],

  prerequisites: [
    "Basic Python familiarity (enough to read and adapt scripts)",
    "No prior machine-learning or electronics expertise required—built from first principles",
    "Curiosity for Computer Vision, Local GenAI, and NVIDIA GPU acceleration",
    "Open to 2nd year engineering students onward across all branches",
    "A laptop with browser and terminal access; Jetson environments and code labs provided",
  ],

  /** Hardware learners get their hands on. */
  hardware: [
    "NVIDIA Jetson Architecture (CUDA Cores, Tensor Cores & Unified Memory)",
    "Cloud-Hosted & Physical Jetson GPU Developer Environments",
    "OpenCV Video Streams & Camera Pipeline Runtimes",
    "Accelerated Local Edge Frameworks (TensorRT, Ollama, llama.cpp, PyTorch)",
  ],

  batches: [] as Batch[],
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
    hook: "The AI model you trained, deployed locally on Jetson GPUs.",
    body: "Go beyond cloud API wrappers. Learn CUDA-accelerated runtimes, TensorRT FP16/INT8 quantization, and deploying 1B–3B Small Language Models locally with Ollama.",
    project: "Multimodal Edge Assistant combining YOLO vision & local Llama 3.2",
  },
  {
    code: "IT",
    name: "Information Technology",
    hook: "Private, on-premise GenAI systems with zero cloud latency.",
    body: "Architect private edge intelligence pipelines. Run local SLMs for automated log generation, scene analysis, and edge data processing without transmitting raw frames upstream.",
    project: "Private Edge GenAI log generator & automated decision-making system",
  },
  {
    code: "ECE",
    name: "Electronics & Communication",
    hook: "Hardware acceleration on NVIDIA Jetson architecture.",
    body: "Master CUDA Cores, Tensor Cores, and Unified Memory. Learn how to convert PyTorch/ONNX models into optimized TensorRT .engine files for ultra-high FPS.",
    project: "TensorRT INT8 engine optimization & jtop/nvpmodel GPU profiling",
  },
  {
    code: "EE",
    name: "Electrical Engineering",
    hook: "Performance-per-watt profiling and Jetson power mode control.",
    body: "Understand power constraints in edge compute. Learn how nvpmodel manages power profiles and measure real-time FPS/watt efficiency during heavy GPU inference.",
    project: "Power profile benchmarking & FPS-per-watt optimization on Jetson",
  },
  {
    code: "ME",
    name: "Mechanical Engineering",
    hook: "Automated visual inspection and robotics intelligence.",
    body: "Deploy Vision-Language Models (VLMs) and YOLO object detection for real-time safety monitoring, defect identification, and industrial automation control.",
    project: "Vision-Language Model safety gear query system for workplace automation",
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
