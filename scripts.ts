import { PrismaClient } from "@prisma/client";


//Only use one connection
const prisma = new PrismaClient({ log: ["query"]});


async function main() {
    await prisma.user.deleteMany()
    const user = await prisma.user.create({
        data: {
            name: "Michael",
            email: "Mike@test.com"
        }
    })

    console.log(user)
}

main()
    .catch(e => {
        console.error(e.message)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })