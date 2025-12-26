export interface StoryProgress {
    completed: boolean;
    quizPassed: boolean;
    unlocked: boolean;
    completedAt?: number;
}

export interface GameProgress {
    stories: {
        MaryJoseph: StoryProgress;
        Innkeeper: StoryProgress;
        Shepherds: StoryProgress;
        WiseMen: StoryProgress;
    };
    totalScore: number;
    lastPlayed: number;
}

export class ProgressManager {
    private static readonly STORAGE_KEY = 'nativity-game-progress';
    private static instance: ProgressManager | null = null;
    private progress: GameProgress;

    constructor() {
        // Implement singleton pattern
        if (ProgressManager.instance) {
            return ProgressManager.instance;
        }
        
        this.progress = this.loadProgress();
        ProgressManager.instance = this;
    }

    public static getInstance(): ProgressManager {
        if (!ProgressManager.instance) {
            ProgressManager.instance = new ProgressManager();
        }
        return ProgressManager.instance;
    }

    private getDefaultProgress(): GameProgress {
        return {
            stories: {
                MaryJoseph: { completed: false, quizPassed: false, unlocked: true },
                Innkeeper: { completed: false, quizPassed: false, unlocked: false },
                Shepherds: { completed: false, quizPassed: false, unlocked: false },
                WiseMen: { completed: false, quizPassed: false, unlocked: false }
            },
            totalScore: 0,
            lastPlayed: Date.now()
        };
    }

    private loadProgress(): GameProgress {
        try {
            const saved = localStorage.getItem(ProgressManager.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure all stories exist (in case we add new ones)
                const defaultProgress = this.getDefaultProgress();
                return {
                    ...defaultProgress,
                    ...parsed,
                    stories: {
                        ...defaultProgress.stories,
                        ...parsed.stories
                    }
                };
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
        }
        return this.getDefaultProgress();
    }

    private saveProgress(): void {
        try {
            this.progress.lastPlayed = Date.now();
            localStorage.setItem(
                ProgressManager.STORAGE_KEY,
                JSON.stringify(this.progress)
            );
        } catch (error) {
            console.error('Failed to save progress:', error);
        }
    }

    public getProgress(): GameProgress {
        return { ...this.progress };
    }

    public isStoryUnlocked(storyName: keyof GameProgress['stories']): boolean {
        return this.progress.stories[storyName]?.unlocked ?? false;
    }

    public isStoryCompleted(storyName: keyof GameProgress['stories']): boolean {
        return this.progress.stories[storyName]?.completed ?? false;
    }

    public hasPassedQuiz(storyName: keyof GameProgress['stories']): boolean {
        return this.progress.stories[storyName]?.quizPassed ?? false;
    }

    public completeStory(storyName: keyof GameProgress['stories']): void {
        if (this.progress.stories[storyName]) {
            this.progress.stories[storyName].completed = true;
            this.progress.stories[storyName].completedAt = Date.now();
            this.saveProgress();
        }
    }

    public passQuiz(storyName: keyof GameProgress['stories']): void {
        if (this.progress.stories[storyName]) {
            this.progress.stories[storyName].quizPassed = true;
            this.progress.totalScore += 10;
            
            console.log(`✅ Quiz passed for ${storyName}!`);
            
            // Unlock next story
            this.unlockNextStory(storyName);
            
            this.saveProgress();
            
            console.log('📊 Current progress:', this.progress);
        }
    }

    private unlockNextStory(currentStory: keyof GameProgress['stories']): void {
        const storyOrder: Array<keyof GameProgress['stories']> = [
            'MaryJoseph',
            'Innkeeper',
            'Shepherds',
            'WiseMen'
        ];

        const currentIndex = storyOrder.indexOf(currentStory);
        if (currentIndex >= 0 && currentIndex < storyOrder.length - 1) {
            const nextStory = storyOrder[currentIndex + 1];
            this.progress.stories[nextStory].unlocked = true;
            console.log(`🔓 Unlocked ${nextStory}!`);
        }
    }

    public getCompletionPercentage(): number {
        const stories = Object.values(this.progress.stories);
        const completed = stories.filter(s => s.completed && s.quizPassed).length;
        return Math.round((completed / stories.length) * 100);
    }

    public getTotalScore(): number {
        return this.progress.totalScore;
    }

    public resetProgress(): void {
        this.progress = this.getDefaultProgress();
        this.saveProgress();
    }

    public unlockAllStories(): void {
        Object.keys(this.progress.stories).forEach(key => {
            const storyKey = key as keyof GameProgress['stories'];
            this.progress.stories[storyKey].unlocked = true;
        });
        this.saveProgress();
    }

    public debugProgress(): void {
        console.log('=== PROGRESS DEBUG ===');
        console.log('Total Score:', this.progress.totalScore);
        console.log('Completion:', this.getCompletionPercentage() + '%');
        console.log('\nStory Status:');
        Object.entries(this.progress.stories).forEach(([name, status]) => {
            console.log(`  ${name}:`, {
                unlocked: status.unlocked ? '🔓' : '🔒',
                completed: status.completed ? '✓' : '✗',
                quizPassed: status.quizPassed ? '✓' : '✗'
            });
        });
        console.log('=====================');
    }
}
