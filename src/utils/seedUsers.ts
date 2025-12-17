import User from "../models/User";

export async function seedDefaultUsers() {
	const adminUsername = process.env.ADMIN_USERNAME || "admin";
	const adminPassword = process.env.ADMIN_PASSWORD || "Admin1234!";

	const userUsername = process.env.USER_USERNAME || "testuser";
	const userPassword = process.env.USER_PASSWORD || "Test1234!";

	// Admin
	const adminExists = await User.findOne({ username: adminUsername });
	if (!adminExists) {
		await User.create({
			username: adminUsername,
			password: adminPassword,
			role: "admin",
			// dummy email:
			email: "admin@local.test",
		});
		console.log("Seeded admin:", adminUsername);
	}

	// Normal user
	const userExists = await User.findOne({ username: userUsername });
	if (!userExists) {
		await User.create({
			username: userUsername,
			password: userPassword,
			role: "user",
			// dummy email:
			email: "testuser@local.test",
		});
		console.log("Seeded user:", userUsername);
	}
}
