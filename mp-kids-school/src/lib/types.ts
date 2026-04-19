import { ArtifactType } from './artifact_types';

export interface TaskMetadata {
    Summary: string;
    ArtifactType: ArtifactType;
}

export interface Task {
    TargetFile: string;
    Overwrite: boolean;
    CodeContent: string;
    EmptyFile: boolean;
    Description: string;
    Complexity: number;
    IsArtifact: boolean;
    ArtifactMetadata?: TaskMetadata;
}
