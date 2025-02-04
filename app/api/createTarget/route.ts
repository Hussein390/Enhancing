import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

//POST
export async function POST(req: NextRequest) {
  try {
    const { name, years } = await req.json();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "You need to sing in first" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user || !user.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    

    const if_name_existsed = await prisma.years.findMany({ where: { name } });

    if (!name || if_name_existsed.length >=1) {
      return NextResponse.json({ error: "Invalid or duplicate name" }, { status: 400 });
    }

    // Convert userId to ObjectId if needed
    const userId = new ObjectId(user.id);
    const getDaysInMonth = (month: number, year: number): number => {
      return new Date(year, month, 0).getDate(); // Month is 1-based (e.g., 1 = January)
    };
    const months = [
      { MonthName: "January", daysCount: getDaysInMonth(1, years) },
      { MonthName: "February", daysCount: getDaysInMonth(2, years) },
      { MonthName: "March", daysCount: getDaysInMonth(3, years) },
      { MonthName: "April", daysCount: getDaysInMonth(4, years) },
      { MonthName: "May", daysCount: getDaysInMonth(5, years) },
      { MonthName: "June", daysCount: getDaysInMonth(6, years) },
      { MonthName: "July", daysCount: getDaysInMonth(7, years) },
      { MonthName: "August", daysCount: getDaysInMonth(8, years) },
      { MonthName: "September", daysCount: getDaysInMonth(9, years) },
      { MonthName: "October", daysCount: getDaysInMonth(10, years) },
      { MonthName: "November", daysCount: getDaysInMonth(11, years) },
      { MonthName: "December", daysCount: getDaysInMonth(12, years) },
    ];

    // Generate months with the correct number of days
    const monthsWithDays = months.map((month) => ({
      ...month,
      days: Array.from({ length: month.daysCount }, () => ({})), // Create the correct number of days
    }));

    const newYear = await prisma.years.create({
      data: {
        years,
        name,
        userId: String(userId) ,
        months: {
          create: monthsWithDays.map((month) => ({
            MonthName: month.MonthName,
            days: {
              create: month.days,
            },
          })),
        },
      },
      include: {
        months: {
          include: {
            days: true,
          },
        },

      },
    });
    revalidatePath('/')
    return NextResponse.json(newYear, { status: 200 });
  } catch (error: any) {
    console.error("Error creating year:", error.message, error.stack);
    return NextResponse.json({ error: "Failed to create year" }, { status: 500 });
  }
}

/// GET
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract 'name' from the query string
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const id = searchParams.get("id");

    // Find the userId based on the session email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = new ObjectId(user.id);

    // Query years using partial matching
    let years;
    if (id) {
      // Fetch data by ID
      years = await prisma.years.findFirst({
        where: { userId: userId.toString(), id },
        include: { months: { include: { days: true } } },
      });
    } else if (name) {
      // Fetch data by Name
      years = await prisma.years.findMany({
        where: {
          userId: userId.toString(),
          name: { contains: name, mode: "insensitive" },
        },
        include: { months: { include: { days: true } } },
      });
    } else {
      return NextResponse.json({ error: "Either id or name is required" }, { status: 400 });
    }
    revalidatePath('/')
    return NextResponse.json(years, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching years:", error.message);
    return NextResponse.json({ error: "Failed to fetch years" }, { status: 500 });
  }
}

// PUT
export async function PUT(req: Request) {
  try {
    const { dayId, isTrue } = await req.json();
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!dayId) {
      return NextResponse.json({ error: "Day ID is required" }, { status: 400 });
    }
    if (isTrue === undefined) {
      return NextResponse.json({ error: "isTrue is required" }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    
    const updatedDay = await prisma.days.update({
      where: {
        id: dayId, 
      },
      data: {
        isTrue,
      },
    });

    // Revalidate the page
    revalidatePath("/");

    return NextResponse.json({ message: "Day updated successfully", updatedDay }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating day:", error.message);
    return NextResponse.json({ error: "Failed to update day" }, { status: 500 });
  }
}

//DELETE
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required to delete" }, { status: 400 });
    }


    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    
    const yearToDelete = await prisma.years.findUnique({
  where: { name },
  include: { months: { include: { days: true } } },
});

    if (yearToDelete) {
      // Delete all days related to each month
      for (const month of yearToDelete.months) {
        await prisma.days.deleteMany({
          where: { monthId: month.id },
        });
      }

      // Delete all months related to the year
      await prisma.months.deleteMany({
        where: { yearsId: yearToDelete.id },
      });

      // Finally, delete the year
      await prisma.years.delete({
        where: { name },
      });

      revalidatePath("/");
      return NextResponse.json({ message: "Day deleted successfully", yearToDelete }, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error updating day:", error.message);
    return NextResponse.json({ error: "Failed to delete day" }, { status: 500 });
  }
}
