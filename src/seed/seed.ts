import mongoose, { Schema } from "mongoose";
import { connectDb } from "../config/db";
import { env } from "../config/env";
import { hashPassword } from "../utils/hash";
import { UserModel } from "../models/User.model";

// Dummy data - all inline
const dummyData = {
  users: [
    {
      email: "parent1@example.com",
      password: "password123",
      name: "Ahmed Ali",
    },
    {
      email: "parent2@example.com",
      password: "password123",
      name: "Fatima Hassan",
    },
    {
      email: "parent3@example.com",
      password: "password123",
      name: "Mohammed Ibrahim",
    },
  ],

  children: [
    {
      name: "Omar Ahmed",
      age: 8,
      gender: "male",
      medicalHistory: "Autism Spectrum Disorder - Diagnosed at age 3, receiving therapy since age 4",
      medications: "None",
      allergies: "Peanuts",
      userId: null, // Will be set after creating users
    },
    {
      name: "Layla Fatima",
      age: 6,
      gender: "female",
      medicalHistory: "Down Syndrome - Born with Down Syndrome, regular checkups",
      medications: "Vitamin supplements",
      allergies: "None",
      userId: null,
    },
    {
      name: "Youssef Mohammed",
      age: 10,
      gender: "male",
      medicalHistory: "ADHD - Diagnosed at age 7, behavioral therapy",
      medications: "Prescribed medication",
      allergies: "Dairy",
      userId: null,
    },
  ],

  carePathTemplates: [
    {
      name: "Autism Support Plan",
      description: "Comprehensive care plan for children with autism",
      duration: 12, // weeks
      tasks: [
        {
          week: 1,
          title: "Initial Assessment",
          description: "Complete initial assessment with therapist",
          instructions: "Schedule appointment and prepare questions",
          expectedOutcome: "Baseline assessment completed",
        },
        {
          week: 2,
          title: "Social Skills Training",
          description: "Begin social skills training sessions",
          instructions: "Attend weekly sessions, practice at home",
          expectedOutcome: "Improved social interaction",
        },
        {
          week: 3,
          title: "Communication Therapy",
          description: "Start communication therapy program",
          instructions: "Practice daily communication exercises",
          expectedOutcome: "Enhanced communication skills",
        },
      ],
    },
    {
      name: "Down Syndrome Care Plan",
      description: "Structured care plan for children with Down Syndrome",
      duration: 16,
      tasks: [
        {
          week: 1,
          title: "Medical Checkup",
          description: "Complete comprehensive medical evaluation",
          instructions: "Bring all medical records",
          expectedOutcome: "Health status documented",
        },
        {
          week: 2,
          title: "Physical Therapy",
          description: "Begin physical therapy sessions",
          instructions: "Attend twice weekly sessions",
          expectedOutcome: "Improved motor skills",
        },
        {
          week: 3,
          title: "Speech Therapy",
          description: "Start speech and language therapy",
          instructions: "Practice exercises daily",
          expectedOutcome: "Better speech clarity",
        },
      ],
    },
    {
      name: "ADHD Management Plan",
      description: "Behavioral and educational support for ADHD",
      duration: 10,
      tasks: [
        {
          week: 1,
          title: "Behavioral Assessment",
          description: "Complete behavioral assessment",
          instructions: "Observe and document behaviors",
          expectedOutcome: "Behavior patterns identified",
        },
        {
          week: 2,
          title: "Structured Routine",
          description: "Implement structured daily routine",
          instructions: "Create and follow daily schedule",
          expectedOutcome: "Improved routine adherence",
        },
        {
          week: 3,
          title: "Focus Training",
          description: "Begin focus and attention training",
          instructions: "Practice concentration exercises",
          expectedOutcome: "Increased attention span",
        },
      ],
    },
  ],

  centers: [
    {
      name: "Al-Amal Special Needs Center",
      address: "123 Main Street, Riyadh",
      phone: "+966501234567",
      description: "Comprehensive center for children with special needs",
      specialties: ["Autism", "Down Syndrome", "Speech Therapy"],
    },
    {
      name: "Hope Development Center",
      address: "456 King Fahd Road, Jeddah",
      phone: "+966507654321",
      description: "Leading center for developmental support",
      specialties: ["ADHD", "Learning Disabilities", "Occupational Therapy"],
    },
    {
      name: "Sunshine Therapy Center",
      address: "789 Prince Sultan Street, Dammam",
      phone: "+966509876543",
      description: "Specialized therapy and rehabilitation center",
      specialties: ["Physical Therapy", "Speech Therapy", "Behavioral Therapy"],
    },
  ],

  professionals: [
    {
      name: "Dr. Sarah Al-Mansouri",
      specialty: "Child Psychologist",
      description: "Specialized in autism and behavioral therapy",
      centerId: null, // Will be set after creating centers
      email: "sarah.almansouri@example.com",
      phone: "+966501111111",
    },
    {
      name: "Dr. Khalid Al-Rashid",
      specialty: "Pediatric Neurologist",
      description: "Expert in developmental disorders",
      centerId: null,
      email: "khalid.alrashid@example.com",
      phone: "+966502222222",
    },
    {
      name: "Aisha Al-Zahrani",
      specialty: "Speech Therapist",
      description: "Certified speech and language therapist",
      centerId: null,
      email: "aisha.alzahrani@example.com",
      phone: "+966503333333",
    },
    {
      name: "Mohammed Al-Otaibi",
      specialty: "Occupational Therapist",
      description: "Specialized in motor skills development",
      centerId: null,
      email: "mohammed.alotaibi@example.com",
      phone: "+966504444444",
    },
  ],

  posts: [
    {
      title: "Tips for Managing Meltdowns",
      content:
        "Here are some effective strategies I've learned for managing meltdowns with my child...",
      authorId: null, // Will be set after creating users
      tags: ["autism", "parenting", "tips"],
      likes: 0,
    },
    {
      title: "Finding the Right Therapist",
      content:
        "After months of searching, I finally found a great therapist. Here's what helped...",
      authorId: null,
      tags: ["therapy", "resources", "advice"],
      likes: 0,
    },
    {
      title: "Celebrating Small Wins",
      content:
        "Today my child said their first complete sentence! It's important to celebrate every milestone...",
      authorId: null,
      tags: ["milestones", "celebration", "progress"],
      likes: 0,
    },
  ],
};

// Create model schemas if they don't exist
const createModelsIfNeeded = () => {
  const models: { [key: string]: mongoose.Model<any> } = {};

  // Child Model
  if (!mongoose.models.Child) {
    const childSchema = new Schema(
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        medicalHistory: { type: String },
        medications: { type: String },
        allergies: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
      },
      { timestamps: true }
    );
    models.Child = mongoose.model("Child", childSchema);
  } else {
    models.Child = mongoose.models.Child;
  }

  // CarePathTemplate Model
  if (!mongoose.models.CarePathTemplate) {
    const taskSchema = new Schema({
      week: { type: Number, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      instructions: { type: String },
      expectedOutcome: { type: String },
    });

    const carePathTemplateSchema = new Schema(
      {
        name: { type: String, required: true },
        description: { type: String },
        duration: { type: Number, required: true },
        tasks: [taskSchema],
      },
      { timestamps: true }
    );
    models.CarePathTemplate = mongoose.model(
      "CarePathTemplate",
      carePathTemplateSchema
    );
  } else {
    models.CarePathTemplate = mongoose.models.CarePathTemplate;
  }

  // CarePath Model
  if (!mongoose.models.CarePath) {
    const carePathSchema = new Schema(
      {
        childId: { type: Schema.Types.ObjectId, ref: "Child", required: true },
        templateId: {
          type: Schema.Types.ObjectId,
          ref: "CarePathTemplate",
          required: true,
        },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
        status: {
          type: String,
          enum: ["active", "completed", "paused"],
          default: "active",
        },
      },
      { timestamps: true }
    );
    models.CarePath = mongoose.model("CarePath", carePathSchema);
  } else {
    models.CarePath = mongoose.models.CarePath;
  }

  // Task Model
  if (!mongoose.models.Task) {
    const taskModelSchema = new Schema(
      {
        carePathId: {
          type: Schema.Types.ObjectId,
          ref: "CarePath",
          required: true,
        },
        week: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        instructions: { type: String },
        expectedOutcome: { type: String },
        completed: { type: Boolean, default: false },
        dueDate: { type: Date },
      },
      { timestamps: true }
    );
    models.Task = mongoose.model("Task", taskModelSchema);
  } else {
    models.Task = mongoose.models.Task;
  }

  // Checkin Model
  if (!mongoose.models.Checkin) {
    const checkinSchema = new Schema(
      {
        carePathId: {
          type: Schema.Types.ObjectId,
          ref: "CarePath",
          required: true,
        },
        date: { type: Date, default: Date.now },
        notes: { type: String },
        rating: { type: Number, min: 1, max: 5 },
      },
      { timestamps: true }
    );
    models.Checkin = mongoose.model("Checkin", checkinSchema);
  } else {
    models.Checkin = mongoose.models.Checkin;
  }

  // Center Model
  if (!mongoose.models.Center) {
    const centerSchema = new Schema(
      {
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        description: { type: String },
        specialties: [{ type: String }],
      },
      { timestamps: true }
    );
    models.Center = mongoose.model("Center", centerSchema);
  } else {
    models.Center = mongoose.models.Center;
  }

  // Professional Model
  if (!mongoose.models.Professional) {
    const professionalSchema = new Schema(
      {
        name: { type: String, required: true },
        specialty: { type: String, required: true },
        description: { type: String },
        centerId: { type: Schema.Types.ObjectId, ref: "Center" },
        email: { type: String },
        phone: { type: String },
      },
      { timestamps: true }
    );
    models.Professional = mongoose.model("Professional", professionalSchema);
  } else {
    models.Professional = mongoose.models.Professional;
  }

  // Post Model
  if (!mongoose.models.Post) {
    const postSchema = new Schema(
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        tags: [{ type: String }],
        likes: { type: Number, default: 0 },
      },
      { timestamps: true }
    );
    models.Post = mongoose.model("Post", postSchema);
  } else {
    models.Post = mongoose.models.Post;
  }

  // PostReport Model
  if (!mongoose.models.PostReport) {
    const postReportSchema = new Schema(
      {
        postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
        reporterId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        reason: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "reviewed", "resolved"],
          default: "pending",
        },
      },
      { timestamps: true }
    );
    models.PostReport = mongoose.model("PostReport", postReportSchema);
  } else {
    models.PostReport = mongoose.models.PostReport;
  }

  return models;
};

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDb();

    // Clear existing data
    console.log("Clearing existing data...");
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
      console.log("Database cleared.");
    } else {
      console.log("Database not connected, skipping drop.");
    }

    // Create models
    const models = createModelsIfNeeded();

    // Seed Users
    console.log("Seeding users...");
    const hashedUsers = await Promise.all(
      dummyData.users.map(async (user) => {
        const { password, ...userData } = user;
        return {
          ...userData,
          passwordHash: await hashPassword(password),
        };
      })
    );
    const createdUsers = await UserModel.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Seed Children
    console.log("Seeding children...");
    const childrenWithParents = dummyData.children.map((child, index) => ({
      ...child,
      userId: createdUsers[index % createdUsers.length]._id,
    }));
    const createdChildren = await models.Child.insertMany(childrenWithParents);
    console.log(`Created ${createdChildren.length} children`);

    // Seed CarePathTemplates
    console.log("Seeding care path templates...");
    const createdTemplates = await models.CarePathTemplate.insertMany(
      dummyData.carePathTemplates
    );
    console.log(`Created ${createdTemplates.length} care path templates`);

    // Seed CarePaths
    console.log("Seeding care paths...");
    const carePaths = createdChildren.map((child, index) => ({
      childId: child._id,
      templateId: createdTemplates[index % createdTemplates.length]._id,
      startDate: new Date(),
      status: "active",
    }));
    const createdCarePaths = await models.CarePath.insertMany(carePaths);
    console.log(`Created ${createdCarePaths.length} care paths`);

    // Seed Tasks
    console.log("Seeding tasks...");
    const tasks: Array<{
      carePathId: mongoose.Types.ObjectId;
      week: number;
      title: string;
      description: string;
      instructions: string;
      expectedOutcome: string;
      completed: boolean;
      dueDate: Date;
    }> = [];
    createdCarePaths.forEach((carePath, carePathIndex) => {
      const template = createdTemplates[carePathIndex % createdTemplates.length];
      template.tasks.forEach((taskTemplate: any) => {
        tasks.push({
          carePathId: carePath._id,
          week: taskTemplate.week,
          title: taskTemplate.title,
          description: taskTemplate.description,
          instructions: taskTemplate.instructions,
          expectedOutcome: taskTemplate.expectedOutcome,
          completed: Math.random() > 0.7, // Random completion status
          dueDate: new Date(
            Date.now() + taskTemplate.week * 7 * 24 * 60 * 60 * 1000
          ),
        });
      });
    });
    const createdTasks = await models.Task.insertMany(tasks);
    console.log(`Created ${createdTasks.length} tasks`);

    // Seed Checkins
    console.log("Seeding checkins...");
    const checkins = createdCarePaths.map((carePath) => ({
      carePathId: carePath._id,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
      notes: "Progress is going well. Child is responding positively to therapy.",
      rating: Math.floor(Math.random() * 3) + 3, // Rating between 3-5
    }));
    const createdCheckins = await models.Checkin.insertMany(checkins);
    console.log(`Created ${createdCheckins.length} checkins`);

    // Seed Centers
    console.log("Seeding centers...");
    const createdCenters = await models.Center.insertMany(dummyData.centers);
    console.log(`Created ${createdCenters.length} centers`);

    // Seed Professionals
    console.log("Seeding professionals...");
    const professionalsWithCenters = dummyData.professionals.map(
      (professional, index) => ({
        ...professional,
        centerId: createdCenters[index % createdCenters.length]._id,
      })
    );
    const createdProfessionals = await models.Professional.insertMany(
      professionalsWithCenters
    );
    console.log(`Created ${createdProfessionals.length} professionals`);

    // Seed Posts
    console.log("Seeding posts...");
    const postsWithAuthors = dummyData.posts.map((post, index) => ({
      ...post,
      authorId: createdUsers[index % createdUsers.length]._id,
    }));
    const createdPosts = await models.Post.insertMany(postsWithAuthors);
    console.log(`Created ${createdPosts.length} posts`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\nSummary:");
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Children: ${createdChildren.length}`);
    console.log(`- Care Path Templates: ${createdTemplates.length}`);
    console.log(`- Care Paths: ${createdCarePaths.length}`);
    console.log(`- Tasks: ${createdTasks.length}`);
    console.log(`- Checkins: ${createdCheckins.length}`);
    console.log(`- Centers: ${createdCenters.length}`);
    console.log(`- Professionals: ${createdProfessionals.length}`);
    console.log(`- Posts: ${createdPosts.length}`);

    console.log("\nTest user credentials:");
    console.log("Email: parent1@example.com, Password: password123");
    console.log("Email: parent2@example.com, Password: password123");
    console.log("Email: parent3@example.com, Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
