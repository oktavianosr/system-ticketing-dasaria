<?php

if (! function_exists("queue_name")) {
    function queue_name(string $name): string
    {
        return config('queue.queue_prefix').$name;
    }
}

if (! function_exists('cache_key')) {
    function cache_key(string $namespace, string $prefix, array $parts): string
    {
        ksort($parts);

        return sprintf('%s:%s:%s', $namespace, $prefix, http_build_query($parts));
    }
}

if (! function_exists('cache_tags')) {
    function cache_tags(string $base, array|string ...$extras): array
    {
        $tags = [$base];

        foreach ($extras as $extra) {
            if (is_array($extra)) {
                $tags = array_merge($tags, $extra);
            } else {
                $tags[] = $extra;
            }
        }
        return array_values(array_unique(array_filter($tags)));
    }
}
