
import Link from "next/link";
import {getContests} from "@/app/protected/trainings/[trainingId]/blocks/actions";
import {
    PlusIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    PencilIcon,
    BookOpenIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
export const revalidate = 60;
interface PageProps {
    params: {
        trainingId: string;
        blockNumber: string;
        title : string;
        description : string;
    };
}

export default async function Page({ params }: PageProps) {
    // Safely extract and convert IDs
    const trainingId = Number(params.trainingId);
    const blockNumber = Number(params.blockNumber);
    const title = params.title;
    const description = params.description;
    // Validate IDs
    if (isNaN(trainingId) || isNaN(blockNumber)) {
        console.error("Invalid trainingId or blockNumber:", { trainingId, blockNumber });

    }

    try {
        // Fetch contests with proper typing
        const contests = await getContests(trainingId, blockNumber);

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 py-8">
                    {/* Header with Block Info */}
                    <div className="mb-8 bg-white rounded-xl shadow-md p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Contest Management</h1>
                                <p className="text-gray-600 mt-2">
                                    Block: <span className="font-medium text-primary">{title}</span>
                                </p>
                                <p className="text-gray-500">{description}</p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href={`/protected/trainings/${params.trainingId}/blocks/${params.blockNumber}`}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    ← Back to Block
                                </Link>
                                <Link
                                    href={`/protected/trainings/${params.trainingId}/blocks/${params.blockNumber}/create-contest`}
                                    className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-sm transition-all flex items-center gap-2"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    New Contest
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contests List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-semibold text-gray-800">Available Contests</h2>
                                    <p className="text-gray-500 mt-1">
                                        {contests.length} {contests.length === 1 ? 'contest' : 'contests'} in this block
                                    </p>
                                </div>

                                {contests.length > 0 ? (
                                    <ul className="divide-y divide-gray-100">
                                        {contests.map((contest) => (
                                            <li key={contest.contestId} className="hover:bg-gray-50 transition-colors">
                                                <Link
                                                    href={`/protected/trainings/${params.trainingId}/blocks/${params.blockNumber}/edit-contests/${contest.contestId}`}
                                                    className="block p-6"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                                                {contest.title}
                                                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {contest.type === 'individual' ? 'Individual' : 'Team'}
                            </span>
                                                            </h3>
                                                            <p className="text-gray-600 mt-1">{contest.description}</p>
                                                        </div>
                                                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <div className="mt-3 flex gap-2 flex-wrap">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Points: {contest.pointPerProblem}
                        </span>
                                                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          Judge: {contest.judge}
                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-8 text-center">
                                        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-lg font-medium text-gray-900">No contests yet</h3>
                                        <p className="mt-1 text-gray-500">
                                            Get started by creating your first contest.
                                        </p>
                                        <div className="mt-6">
                                            <Link
                                                href={`/protected/trainings/${params.trainingId}/blocks/${params.blockNumber}/create-contest`}
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
                                            >
                                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                                                New Contest
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Block Info Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Block Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Title</p>
                                        <p className="mt-1 text-gray-800">{title}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Description</p>
                                        <p className="mt-1 text-gray-800">{description}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                        <p className="mt-1">

                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Schedule</p>
                                        {/*<p className="mt-1 text-gray-800">*/}
                                        {/*    {new Date(block.date).toLocaleDateString('en-US', {*/}
                                        {/*        weekday: 'long',*/}
                                        {/*        year: 'numeric',*/}
                                        {/*        month: 'long',*/}
                                        {/*        day: 'numeric',*/}
                                        {/*    })}*/}
                                        {/*</p>*/}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <Link
                                        href={`/protected/trainings/${params.trainingId}/blocks/${params.blockNumber}/edit`}
                                        prefetch={false}
                                        className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                                    >
                                        <PencilIcon className="h-5 w-5 text-gray-500" />
                                        Edit Block Details
                                    </Link>
                                    <Link
                                        href={`/protected/trainings/${params.trainingId}/blocks/${params.blockNumber}/materials`}
                                        prefetch={false}
                                        className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                                    >
                                        <BookOpenIcon className="h-5 w-5 text-gray-500" />
                                        View Materials
                                    </Link>
                                    <Link
                                        href={`/protected/trainings/${params.trainingId}/blocks/${params.blockNumber}/leaderboard`}
                                        prefetch={false}
                                        className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                                    >
                                        <ChartBarIcon className="h-5 w-5 text-gray-500" />
                                        View Leaderboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch contests:", error);
    }
}