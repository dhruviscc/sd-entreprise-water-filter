import { NextResponse } from 'next/server';
import { servicesService } from '@/modules/services/servicesService';



const getErrorMessage = (error: any) => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'object' && error !== null) {
        return error.message || error.details || error.hint || JSON.stringify(error);
    }
    return String(error);
};

export async function GET() {
    try {
        const services = await servicesService.getAll(false);
        return NextResponse.json(services);
    } catch (error) {
        console.error("Error in GET /admin/api/services:", error); // Log the full error object
        return NextResponse.json(
            { error: "Failed to fetch services", details: getErrorMessage(error) },
            { status: 500 }
        );
    }

}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const service = await servicesService.create(body);
        return NextResponse.json(service);
    } catch (error) {
        console.error("Error in POST /admin/api/services:", error);
        return NextResponse.json(
            { error: "Failed to create service", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const { id, ...data } = await req.json();
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        const service = await servicesService.update(id, data);
        return NextResponse.json(service);
    } catch (error) {
        console.error("Error in PUT /admin/api/services:", error);
        return NextResponse.json(
            { error: "Failed to update service", details: getErrorMessage(error) },
            { status: 500 }
        );
    }

}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        await servicesService.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /admin/api/services:", error);
        return NextResponse.json(
            { error: "Failed to delete service", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}