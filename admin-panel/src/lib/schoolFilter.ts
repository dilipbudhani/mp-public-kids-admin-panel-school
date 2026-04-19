import { NextRequest } from "next/server";

/**
 * Extracts the schoolId from the request headers or query parameters.
 * Priority: Header 'x-school-id' > Query param 'schoolId'
 */
export function getSchoolId(req: NextRequest): string | null {
    const headerSchoolId = req.headers.get('x-school-id');
    if (headerSchoolId) return headerSchoolId;

    const url = new URL(req.url);
    const querySchoolId = url.searchParams.get('schoolId');
    return querySchoolId;
}

/**
 * Returns a MongoDB query object based on the schoolId and the model's school field name.
 */
export function getSchoolFilter(req: NextRequest, fieldName: 'schoolId' | 'schoolIds' = 'schoolId') {
    const schoolId = getSchoolId(req);
    if (!schoolId) return {};

    if (fieldName === 'schoolIds') {
        return { schoolIds: schoolId };
    }
    return { schoolId: schoolId };
}
