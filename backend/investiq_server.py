#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from src.main import run

if __name__ == "__main__":
    print("Starting InvestIQ server on http://127.0.0.1:8080")
    run()