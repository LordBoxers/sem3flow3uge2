package webscraper;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;


class TagHandler implements Callable<TagDTO> {
  TagCounter tc;
  TagHandler(TagCounter tc){
    this.tc = tc;
  }
  @Override
  public TagDTO call() throws Exception {
    tc.doWork();
    return new TagDTO(tc);
  }
}


public class Tester {

    public static List<TagCounter> runSequental() {
        List<TagCounter> urls = new ArrayList();
        urls.add(new TagCounter("https://www.fck.dk"));
        urls.add(new TagCounter("https://www.google.com"));
        urls.add(new TagCounter("https://politiken.dk"));
        urls.add(new TagCounter("https://cphbusiness.dk"));
        for (TagCounter tc : urls) {
            tc.doWork();
        }
        return urls;
    }

    public static List<TagDTO> runParrallel(ExecutorService es) throws InterruptedException, ExecutionException, TimeoutException  {
       // ExecutorService es = Executors.newCachedThreadPool();
        List<TagCounter> urls = new ArrayList();
        urls.add(new TagCounter("https://www.fck.dk"));
        urls.add(new TagCounter("https://www.google.com"));
        urls.add(new TagCounter("https://politiken.dk"));
        urls.add(new TagCounter("https://cphbusiness.dk"));
        
        List<TagDTO> tagDTOs = new ArrayList<>();
        
        List<Future<TagDTO>> futures = new ArrayList<>();
        //Start alle tråde (Callables)
        for (TagCounter tc : urls) {
            TagHandler tagHandler = new TagHandler(tc);
            Future<TagDTO> tag = es.submit(tagHandler);
            futures.add(tag);
        }
        //Få resultater
        List<TagDTO> results = new ArrayList<>();
        for (Future<TagDTO> f : futures) {
            //promise.then(res=> //do something)
            results.add(f.get(10, TimeUnit.SECONDS));
        }
        return results;
    }

    public static void main(String[] args) throws Exception {
        long timeSequental;
        long start = System.nanoTime();

        List<TagCounter> fetchedData = new Tester().runSequental();
        long end = System.nanoTime();
        timeSequental = end - start;
        System.out.println("Time Sequential: " + ((timeSequental) / 1_000_000) + " ms.");

        for (TagCounter tc : fetchedData) {
            System.out.println("Title: " + tc.getTitle());
            System.out.println("Div's: " + tc.getDivCount());
            System.out.println("Body's: " + tc.getBodyCount());
            System.out.println("----------------------------------");
        }

       start = System.nanoTime();
        //TODO Add your parrallel calculation here
        ExecutorService es = Executors.newCachedThreadPool();
        Tester.runParrallel(es);
        long timeParallel = System.nanoTime() - start;
        System.out.println("Time Parallel: " + ((timeParallel) / 1_000_000) + " ms.");
        System.out.println("Paralle was " + timeSequental / timeParallel + " times faster");
        es.shutdown();
    }
}



