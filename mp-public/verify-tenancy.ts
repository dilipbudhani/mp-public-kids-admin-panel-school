import { dbConnect } from "./src/lib/mongodb";
import Lead from "./src/models/Lead";

async function verifyTenancy() {
    try {
        await dbConnect();

        console.log("Creating a mock lead for mp-kids-school...");
        const kidsSchoolLead = await Lead.create({
            childName: "Security Test Kid",
            parentName: "Testing Parent",
            contactNumber: "9999999999",
            email: "test@security.com",
            applyingForClass: "Class 1",
            schoolId: "mp-kids-school",
        });

        console.log("Mock lead created with ID:", kidsSchoolLead._id);

        console.log("Attempting to query all leads (should be scoped by mp-public)...");
        const publicLeads = await Lead.find();

        const found = publicLeads.some(l => l._id.toString() === kidsSchoolLead._id.toString());

        if (found) {
            console.error("❌ SECURITY FAILURE: mp-public context accessed mp-kids-school data!");
        } else {
            console.log("✅ SECURITY SUCCESS: Data is isolated. mp-public context cannot see mp-kids-school lead.");
        }

        console.log("Cleaning up mock lead...");
        // Manually bypassing the plugin to clean up the test record
        const mongoose = require('mongoose');
        await mongoose.connection.collection('leads').deleteOne({ _id: kidsSchoolLead._id });
        console.log("Cleanup complete.");

        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

verifyTenancy();
