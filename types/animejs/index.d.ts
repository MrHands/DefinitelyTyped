type FunctionBasedParameter = (element: HTMLElement, index: number, length: number) => number;
type AnimeCallbackFunction = (anim: anime.AnimeInstance) => void;
type CustomEasingFunction = (el: HTMLElement, index: number, length: number) => (time: number) => number;
// Allowing null is necessary because DOM queries may not return anything.
type AnimeTarget = string | object | HTMLElement | SVGElement | NodeList | null;

declare namespace anime {
    type EasingFunc = (t: number) => number;

    type EasingLinearOptions =
        | "linear"
        | "easeInQuad"
        | "easeInCubic"
        | "easeInQuart"
        | "easeInQuint"
        | "easeInSine"
        | "easeInExpo"
        | "easeInCirc"
        | "easeInBack"
        | "easeInBounce";
    type EasingLinearFunc = () => EasingFunc;

    type EasingSigmoidOptions =
        | "easeInElastic" // the Elastic() function is always a sigmoid
        | "easeOutQuad"
        | "easeOutCubic"
        | "easeOutQuart"
        | "easeOutQuint"
        | "easeOutSine"
        | "easeOutExpo"
        | "easeOutCirc"
        | "easeOutBack"
        | "easeOutElastic"
        | "easeOutBounce"
        | "easeInOutQuad"
        | "easeInOutCubic"
        | "easeInOutQuart"
        | "easeInOutQuint"
        | "easeInOutSine"
        | "easeInOutExpo"
        | "easeInOutCirc"
        | "easeInOutBack"
        | "easeInOutElastic"
        | "easeInOutBounce";
    type EasingSigmoidFunc = (amplitude: number, period: number) => EasingFunc;

    type EasingOptions =
        | EasingLinearOptions
        | EasingSigmoidOptions;

    type DirectionOptions = "reverse" | "alternate" | "normal";

    interface AnimeCallBack {
        begin?: AnimeCallbackFunction | undefined;
        change?: AnimeCallbackFunction | undefined;
        update?: AnimeCallbackFunction | undefined;
        complete?: AnimeCallbackFunction | undefined;
        loopBegin?: AnimeCallbackFunction | undefined;
        loopComplete?: AnimeCallbackFunction | undefined;
        changeBegin?: AnimeCallbackFunction | undefined;
        changeComplete?: AnimeCallbackFunction | undefined;
    }

    interface AnimeInstanceParams extends AnimeCallBack {
        loop?: number | boolean | undefined;
        autoplay?: boolean | undefined;
        direction?: DirectionOptions | string | undefined;
    }

    interface AnimeAnimParams extends AnimeCallBack {
        targets?: AnimeTarget | readonly AnimeTarget[] | undefined;

        duration?: number | FunctionBasedParameter | undefined;
        delay?: number | FunctionBasedParameter | undefined;
        endDelay?: number | FunctionBasedParameter | undefined;
        elasticity?: number | FunctionBasedParameter | undefined;
        round?: number | boolean | FunctionBasedParameter | undefined;
        keyframes?: readonly AnimeAnimParams[] | undefined;

        easing?: EasingOptions | string | CustomEasingFunction | ((el: HTMLElement) => string) | undefined;

        [AnyAnimatedProperty: string]: any;
    }

    interface AnimeParams extends AnimeInstanceParams, AnimeAnimParams {
        // Just need this to merge both Params interfaces.
    }

    interface Animatable {
        id: number;
        target: HTMLElement;
        total: number;
        transforms: object;
    }

    interface Animation {
        animatable: Animatable;
        currentValue: string;
        delay: number;
        duration: number;
        endDelay: number;
        property: string;
        tweens: readonly object[];
        type: string;
    }

    interface AnimeInstance extends AnimeCallBack {
        play(): void;
        pause(): void;
        restart(): void;
        reverse(): void;
        seek(time: number): void;
        tick(time: number): void;

        began: boolean;
        paused: boolean;
        completed: boolean;
        finished: Promise<void>;

        autoplay: boolean;
        currentTime: number;
        delay: number;
        direction: string;
        duration: number;
        loop: number | boolean;
        timelineOffset: number;
        progress: number;
        remaining: number;
        reversed: boolean;

        animatables: readonly Animatable[];
        animations: readonly Animation[];
    }

    interface AnimeTimelineAnimParams extends AnimeAnimParams {
        timelineOffset: number | string | FunctionBasedParameter;
    }

    interface AnimeTimelineInstance extends AnimeInstance {
        add(params: AnimeAnimParams, timelineOffset?: string | number): AnimeTimelineInstance;
    }

    interface StaggerOptions {
        start?: number | string | undefined;
        direction?: "normal" | "reverse" | undefined;
        easing?: CustomEasingFunction | string | EasingOptions | undefined;
        grid?: readonly number[] | undefined;
        axis?: "x" | "y" | undefined;
        from?: "first" | "last" | "center" | number | undefined;
    }

    // Exported members and functions
    const version: string;
    let speed: number;
    let suspendWhenDocumentHidden: boolean;
    const running: AnimeInstance[];
    function remove(targets: AnimeTarget | readonly AnimeTarget[]): void;
    function get(targets: AnimeTarget, prop: string, unit?: string): string | number;
    function set(targets: AnimeTarget, value: { [AnyAnimatedProperty: string]: any }): void;
    function convertPx(el: HTMLElement | SVGElement | null, val: string, unit: string): number;
    function path(path: string | HTMLElement | SVGElement | null, percent?: number): (prop: string) => {
        el: HTMLElement | SVGElement;
        property: string;
        totalLength: number;
    };
    function setDashoffset(el: HTMLElement | SVGElement | null): number;
    function stagger(
        value: number | string | ReadonlyArray<number | string>,
        options?: StaggerOptions,
    ): FunctionBasedParameter;
    function timeline(params?: AnimeParams | readonly AnimeInstance[]): AnimeTimelineInstance;
    function easing(easing: string | EasingFunc, duration?: number): EasingFunc;
    const penner:
        & {
            [Key in EasingLinearOptions]: EasingLinearFunc;
        }
        & {
            [Key in EasingSigmoidOptions]: EasingSigmoidFunc;
        };
    function random(min: number, max: number): number;
}

declare function anime(params: anime.AnimeParams): anime.AnimeInstance;

export = anime;
export as namespace anime;
